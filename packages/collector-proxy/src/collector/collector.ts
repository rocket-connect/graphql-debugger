import express, { Express } from 'express';
import { prisma } from '../prisma';
import { z } from 'zod';
import { ExportTraceServiceRequestSchema } from './schema';
import { debug } from '../debug';
import crypto from 'crypto';
import { print, parse, lexicographicSortSchema, printSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

export const collector: Express = express();
collector.use(express.json());

const schema = z.object({
  body: ExportTraceServiceRequestSchema.required(),
});

collector.post('/v1/traces', async (req, res) => {
  try {
    let body: z.infer<typeof schema>['body'];

    try {
      const parsed = schema.parse({ body: req.body });
      body = parsed.body;
    } catch (error) {
      debug('Error parsing body', error);

      return res
        .status(400)
        .json({
          message: (error as Error).message,
        })
        .end();
    }

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
          }, {});

          return {
            spanId: s.spanId,
            traceId: s.traceId,
            parentSpanId: s.parentSpanId,
            name: s.name,
            kind: s.kind,
            startTimeUnixNano: s.startTimeUnixNano,
            endTimeUnixNano: s.endTimeUnixNano,
            attributes: JSON.stringify(attributes),
          };
        });
      });

      return _spans;
    });

    setTimeout(() => {
      (async () => {
        try {
          for await (const span of spans) {
            const existingSpan = await prisma.span.findFirst({
              where: {
                spanId: span.spanId,
              },
            });

            if (existingSpan) {
              continue;
            }

            const attributes = JSON.parse(span.attributes);

            let traceGroupId = '';

            let schemaHash = '';
            if (attributes['graphql.schema.hash']) {
              schemaHash = attributes['graphql.schema.hash'];
            }

            const foundTraceGroup = await prisma.traceGroup.findFirst({
              where: {
                traceId: span.traceId,
              },
            });

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
                  const schema = await prisma.schema.findFirst({
                    where: {
                      hash: schemaHash,
                    },
                  });

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

            await prisma.span.create({
              data: {
                spanId: span.spanId,
                parentSpanId: span.parentSpanId,
                name: span.name,
                kind: span.kind.toString(),
                startTimeUnixNano: span.startTimeUnixNano,
                endTimeUnixNano: span.endTimeUnixNano,
                attributes: span.attributes,
                traceId: span.traceId,
                traceGroupId,
              },
            });
          }
        } catch (error) {
          const e = error as Error;
          debug('Error creating span', e);
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
