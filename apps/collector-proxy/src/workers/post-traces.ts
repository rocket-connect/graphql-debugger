import { DebuggerClient } from "@graphql-debugger/client";
import { extractSpans } from "@graphql-debugger/opentelemetry";
import { Queue } from "@graphql-debugger/queue";
import {
  AttributeNames,
  ExtractedSpan,
  ForeignTraces,
  PostTraces,
} from "@graphql-debugger/types";

import { debug } from "../debug";

export function postTracesWorker({
  client,
  foreignTracesQueue,
}: {
  client: DebuggerClient;
  foreignTracesQueue: Queue<ForeignTraces>;
}) {
  return async (data: PostTraces["body"]) => {
    debug("postTracesWorker started");

    try {
      const spans = extractSpans({
        resourceSpans: data.resourceSpans,
      });

      const spanIds = spans.map((s) => s.spanId);
      const traceIds = spans.map((s) => s.traceId);
      const schemaHashes = spans
        .map((s) => s.graphqlSchemaHash)
        .filter(Boolean) as string[];

      const [{ spans: existingSpans }, traceGroups, schemas] =
        await Promise.all([
          client.span.findMany({ where: { spanIds } }),
          client.trace.findMany({ where: { traceIds } }),
          client.schema.findMany({ where: { schemaHashes } }),
        ]);

      const isExistingSpan = (span: ExtractedSpan) => {
        return existingSpans.find((eS) => eS.spanId === span.spanId);
      };

      const isForeignSpan = (span: ExtractedSpan) => {
        return !isExistingSpan(span) && span.isForeign;
      };

      const isPluginSpan = (span: ExtractedSpan) => {
        return (
          !isExistingSpan(span) &&
          !isForeignSpan(span) &&
          !span.parentSpanId &&
          !span.attributes?.[AttributeNames.OPERATION_ROOT]
        );
      };

      const spansToBeCreated = spans.filter(
        (s) => !isExistingSpan(s) && !isForeignSpan(s) && !isPluginSpan(s),
      );

      await Promise.all(
        spansToBeCreated.map(async (span) => {
          let traceGroupId: string;

          const foundTraceGroup = traceGroups.find(
            (t) => t.traceId === span.traceId,
          );
          if (foundTraceGroup) {
            traceGroupId = foundTraceGroup?.id;
          } else {
            try {
              const createdTraceGroup = await client.trace.createOne({
                input: {
                  traceId: span.traceId,
                },
              });
              traceGroupId = createdTraceGroup.trace.id;

              if (span.graphqlSchemaHash) {
                const schema = schemas.find(
                  (s) => s.hash === span.graphqlSchemaHash,
                );
                if (schema) {
                  await client.trace.updateOne({
                    where: {
                      id: traceGroupId,
                    },
                    input: {
                      schemaId: schema.id,
                    },
                  });
                }
              }
            } catch (error) {
              const foundTraceGroup = await client.trace.findFirst({
                where: {
                  traceId: span.traceId,
                },
              });
              if (!foundTraceGroup) {
                debug("Error creating trace group", error);
                throw error;
              }
              traceGroupId = foundTraceGroup.id;
            }
          }

          await client.span.createOne({
            input: {
              spanId: span.spanId,
              parentSpanId: span.parentSpanId,
              name: span.name,
              kind: span.kind,
              startTimeUnixNano: span.startTimeUnixNano,
              endTimeUnixNano: span.endTimeUnixNano,
              traceId: span.traceId,
              traceGroupId,
              errorMessage: span.errorMessage,
              errorStack: span.errorStack,
              graphqlDocument: span.graphqlDocument,
              graphqlVariables: span.graphqlVariables,
              graphqlResult: span.graphqlResult,
              graphqlContext: span.graphqlContext,
              graphqlSchemaHash: span.graphqlSchemaHash,
              graphqlOperationName: span.graphqlOperationName,
              graphqlOperationType: span.graphqlOperationType,
              isForeign: span.isForeign,
              isGraphQLRootSpan: Boolean(
                span.attributes?.[AttributeNames.OPERATION_ROOT],
              ),
            },
          });
        }),
      );

      const foreignSpans = spans.filter(isForeignSpan);
      if (foreignSpans.length) {
        foreignTracesQueue.add({
          extractedSpans: foreignSpans,
          attempt: 1,
        });
      }

      const pluginSpans = spans.filter(isPluginSpan);
      if (pluginSpans.length) {
        foreignTracesQueue.add({
          extractedSpans: pluginSpans,
          attempt: 1,
        });
      }
    } catch (error) {
      const e = error as Error;
      debug("postTracesWorker Error: ", e);
    } finally {
      debug("postTracesWorker finished");
    }
  };
}
