import express, { Express } from 'express';
import { prisma } from '../prisma';
import { z } from 'zod';
import { ExportTraceServiceRequestSchema } from './schema';
import { debug } from '../debug';
import crypto from 'crypto';
import { print, parse, lexicographicSortSchema, printSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { AttributeName } from '@graphql-debugger/trace-schema';

export const collector: Express = express();
collector.use(express.json());

const schema = z.object({
  body: ExportTraceServiceRequestSchema.required(),
});

collector.post('/v1/traces', async (req, res) => {
  try {
    let body: z.infer<typeof schema>['body'];

    try {
      // const parsed = schema.parse({ body: req.body }); Skip parsing for now for performance reasons
      body = req.body as z.infer<typeof schema>['body'];
    } catch (error) {
      debug('Error parsing body', error);

      return res
        .status(400)
        .json({
          message: (error as Error).message,
        })
        .end();
    }

    // return res.status(200).json({}).end();

    const spans = (body.resourceSpans || []).flatMap((rS) => {
      const _spans = rS.scopeSpans.flatMap((sS) => {
        return (sS.spans || []).map((s) => {
          const attributes = s.attributes.reduce((acc, val) => {
            const value = val.value;
            let realValue: any;

            if (value.boolValue !== undefined) {
              realValue = value.boolValue;
            } else if (value.stringValue !== undefined) {
              realValue = value.stringValue;
            } else if (value.intValue !== undefined) {
              realValue = value.intValue;
            } else if (value.doubleValue !== undefined) {
              realValue = value.doubleValue;
            } else if (value.arrayValue !== undefined) {
              realValue = value.arrayValue;
            }

            return { ...acc, [val.key]: realValue };
          }, {}) as Record<string, any>;

          const firstError = s.events.find((e) => e.name === 'exception');
          let errorMessage: string | undefined;
          let errorStack: string | undefined;
          if (firstError) {
            const message = firstError.attributes.find((a) => a.key === 'exception.message');
            const stack = firstError.attributes.find((a) => a.key === 'exception.stacktrace');
            errorMessage = message?.value.stringValue || 'Unknown Error';
            errorStack = stack?.value.stringValue;
          }

          return {
            spanId: s.spanId,
            traceId: s.traceId,
            parentSpanId: s.parentSpanId,
            name: s.name,
            kind: s.kind,
            startTimeUnixNano: s.startTimeUnixNano,
            endTimeUnixNano: s.endTimeUnixNano,
            attributes: JSON.stringify(attributes),
            errorMessage,
            errorStack,
          };
        });
      });

      return _spans;
    });

    const spanIds = spans.map((s) => s.spanId);
    const traceIds = spans.map((s) => s.traceId);
    const schemaHashes = spans.map((s) => {
      const attributes = JSON.parse(s.attributes || '{}');
      return attributes['graphql.schema.hash'];
    });

    const [existingSpans, traceGroups, schemas] = await Promise.all([
      prisma.span.findMany({ where: { spanId: { in: spanIds } } }),
      prisma.traceGroup.findMany({ where: { traceId: { in: traceIds } } }),
      prisma.schema.findMany({ where: { hash: { in: schemaHashes } } }),
    ]);

    const spansToBeCreated = spans.filter(
      (s) => !existingSpans.find((eS) => eS.spanId === s.spanId)
    );

    // We are using SQLite and all this data is quite alot for it to handle
    // This trace collection, is for development purposes only!
    // We leverage setTimeout to give SQLite some time to breathe
    // This is not a good solution, but it works for now, it also allows the UI to be more responsive
    setTimeout(() => {
      (async () => {
        try {
          await Promise.all(
            spansToBeCreated.map(async (span) => {
              const attributes = JSON.parse(span.attributes);
              let traceGroupId = '';

              let schemaHash = '';
              if (!span.parentSpanId && attributes[AttributeName.SCHEMA_HASH]) {
                schemaHash = attributes[AttributeName.SCHEMA_HASH];
              }

              const document = attributes[AttributeName.DOCUMENT];
              let graphqlDocument: string | undefined;
              if (!span.parentSpanId && document) {
                try {
                  const parsed = parse(document);
                  const printed = print(parsed);

                  graphqlDocument = printed;
                } catch (error) {
                  debug('Error parsing document', error);
                  throw error;
                }
              }

              const variables = attributes[AttributeName.OPERATION_ARGS];
              let graphqlVariables: string | undefined;
              if (!span.parentSpanId && variables) {
                try {
                  graphqlVariables = JSON.stringify(JSON.parse(variables));
                } catch (error) {
                  debug('Error parsing variables', error);
                  throw error;
                }
              }

              const foundTraceGroup = traceGroups.find((t) => t.traceId === span.traceId);
              if (foundTraceGroup) {
                traceGroupId = foundTraceGroup?.id;
              } else {
                try {
                  const createdTraceGroup = await prisma.traceGroup.create({
                    data: {
                      traceId: span.traceId,
                    },
                  });
                  traceGroupId = createdTraceGroup.id;

                  if (schemaHash) {
                    const schema = schemas.find((s) => s.hash === schemaHash);
                    if (schema) {
                      await prisma.traceGroup.update({
                        where: {
                          id: traceGroupId,
                        },
                        data: {
                          schemaId: schema.id,
                        },
                      });
                    }
                  }
                } catch (error) {
                  const foundTraceGroup = await prisma.traceGroup.findFirst({
                    where: {
                      traceId: span.traceId,
                    },
                  });

                  if (!foundTraceGroup) {
                    debug('Error creating trace group', error);
                    throw error;
                  }

                  traceGroupId = foundTraceGroup.id;
                }
              }

              setTimeout(() => {
                (async () => {
                  try {
                    const startTimeUnixNano = BigInt(span.startTimeUnixNano);
                    const endTimeUnixNano = BigInt(span.endTimeUnixNano);
                    const durationNano = endTimeUnixNano - startTimeUnixNano;

                    await prisma.span.create({
                      data: {
                        spanId: span.spanId,
                        parentSpanId: span.parentSpanId,
                        name: span.name,
                        kind: span.kind.toString(),
                        startTimeUnixNano,
                        endTimeUnixNano,
                        durationNano,
                        traceId: span.traceId,
                        traceGroupId,
                        errorMessage: span.errorMessage,
                        errorStack: span.errorStack,
                        graphqlDocument,
                        graphqlVariables,
                      },
                    });
                  } catch (error) {
                    debug('Error creating span', error);
                  }
                })();
              });
            })
          );
        } catch (error) {
          const e = error as Error;
          debug('Error creating spans', e);
        }
      })();
    });

    return res.status(200).json({}).end();
  } catch (error) {
    debug('Error posting traces', error);

    return res.status(500).json({}).end();
  }
});

collector.post('/v1/schema', async (req, res) => {
  const schema = req.body.schema;

  if (!schema) {
    return res.status(400).json({}).end();
  } else if (typeof schema !== 'string') {
    return res.status(400).json({}).end();
  }

  const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    noLocation: true,
  });

  const sortedSchema = lexicographicSortSchema(executableSchema);
  const printed = printSchema(sortedSchema);
  const hash = crypto.createHash('sha256').update(printed).digest('hex');

  const foundSchema = await prisma.schema.findFirst({
    where: {
      hash,
    },
  });

  if (foundSchema) {
    return res.status(200).json({}).end();
  }

  await prisma.schema.create({
    data: {
      hash,
      typeDefs: print(parse(schema)),
    },
  });

  return res.status(200).json({}).end();
});
