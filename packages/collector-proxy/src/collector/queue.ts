import fastq from 'fastq';
import { schema } from './schema';
import { z } from 'zod';
import { prisma } from '../prisma';
import { debug } from '../debug';
import { print, parse } from 'graphql';
import { AttributeName } from '@graphql-debugger/trace-schema';

export type Data = z.infer<typeof schema>['body'];

export const queue = fastq.promise<Data>(worker, 1);

async function worker(data: Data) {
  (async () => {
    try {
      const body = data;

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

            const firstError = (s.events || []).find((e) => e.name === 'exception');
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

          const result = attributes[AttributeName.OPERATION_RESULT];
          let graphqlResult: string | undefined;
          if (!span.parentSpanId && result) {
            try {
              graphqlResult = JSON.stringify({
                result: JSON.parse(result),
              });
            } catch (error) {
              debug('Error parsing result', error);
              throw error;
            }
          }

          const context = attributes[AttributeName.OPERATION_CONTEXT];
          let graphqlContext: string | undefined;
          if (!span.parentSpanId && context) {
            try {
              graphqlContext = context;
            } catch (error) {
              debug('Error parsing context', error);
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
              graphqlResult,
              graphqlContext,
            },
          });
        })
      );
    } catch (error) {
      const e = error as Error;
      debug('Error creating spans', e);
    }
  })();
}

export default queue;
