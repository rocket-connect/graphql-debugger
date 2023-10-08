import { prisma } from "@graphql-debugger/data-access";
import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import type { ForeignTraces } from "@graphql-debugger/types";

import { debug } from "../debug";

export async function foreignTracesWorker(
  data: ForeignTraces,
  retry: (data: ForeignTraces) => void,
) {
  debug("foreignTracesWorker started");

  try {
    const spans = data.extractedSpans;
    const spanIds = spans.map((s) => s.spanId);
    const traceIds = spans.map((s) => s.traceId);

    const [existingSpans, traceGroups] = await Promise.all([
      prisma.span.findMany({ where: { spanId: { in: spanIds } } }),
      prisma.traceGroup.findMany({ where: { traceId: { in: traceIds } } }),
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
            const foundTraceGroup = await prisma.traceGroup.findFirst({
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
            if (data.retryCount < 3) {
              data.retryCount = data.retryCount + 1;
              retry(data);
            }

            return;
          }
        }

        const startTimeUnixNano = new UnixNanoTimeStamp(span.startTimeUnixNano);
        const endTimeUnixNano = new UnixNanoTimeStamp(span.endTimeUnixNano);
        const durationNano = UnixNanoTimeStamp.duration(
          startTimeUnixNano,
          endTimeUnixNano,
        );

        await prisma.span.create({
          data: {
            spanId: span.spanId,
            parentSpanId: span.parentSpanId,
            name: span.name,
            kind: span.kind.toString(),
            startTimeUnixNano: startTimeUnixNano.toStorage(),
            endTimeUnixNano: endTimeUnixNano.toStorage(),
            durationNano: durationNano.toStorage(),
            traceId: span.traceId,
            traceGroupId,
            errorMessage: span.errorMessage,
            errorStack: span.errorStack,
            graphqlDocument: span.graphqlDocument,
            graphqlVariables: span.graphqlVariables,
            graphqlResult: span.graphqlResult,
            graphqlContext: span.graphqlContext,
            isForeign: span.isForeign,
            attributes: span.attributes,
          },
        });
      }),
    );
  } catch (error) {
    debug("foreignTracesWorker Error: ", error);
  } finally {
    debug("foreignTracesWorker finished");
  }
}
