import { DebuggerClient } from "@graphql-debugger/client";
import type { ForeignTraces } from "@graphql-debugger/types";

import { debug } from "../debug";

export function foreignTracesWorker({ client }: { client: DebuggerClient }) {
  return async (data: ForeignTraces, retry: (data: ForeignTraces) => void) => {
    debug("foreignTracesWorker started");

    try {
      const spans = data.extractedSpans;
      const spanIds = spans.map((s) => s.spanId);
      const traceIds = spans.map((s) => s.traceId);

      const [{ spans: existingSpans }, traceGroups] = await Promise.all([
        client.span.findMany({ where: { spanIds } }),
        client.trace.findMany({ where: { traceIds } }),
      ]);

      const spansToBeCreated = spans.filter(
        (s) => !existingSpans.find((eS) => eS.spanId === s.spanId),
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
              const foundTraceGroup = await client.trace.findFirst({
                where: {
                  traceId: span.traceId,
                },
              });
              if (!foundTraceGroup) {
                debug("Error creating trace group");
                throw new Error("Trace group not found");
              }
              traceGroupId = foundTraceGroup.id;
            } catch (error) {
              if (data.attempt < 10) {
                data.attempt = data.attempt + 1;
                setTimeout(() => retry(data), 1000);
              }

              return;
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
              isForeign: span.isForeign,
              attributes: JSON.stringify(span.attributes),
            },
          });
        }),
      );
    } catch (error) {
      debug("foreignTracesWorker Error: ", error);
    } finally {
      debug("foreignTracesWorker finished");
    }
  };
}
