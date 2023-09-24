import { prisma } from "@graphql-debugger/data-access";
import { extractSpans } from "@graphql-debugger/opentelemetry";
import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { PostTraces } from "@graphql-debugger/types";

import { debug } from "../debug";

export async function postTracesWorker(data: PostTraces["body"]) {
  debug("Worker started");

  try {
    const spans = extractSpans({
      resourceSpans: data.resourceSpans,
    });

    const spanIds = spans.map((s) => s.spanId);
    const traceIds = spans.map((s) => s.traceId);
    const schemaHashes = spans
      .map((s) => s.graphqlSchemaHash)
      .filter(Boolean) as string[];

    const [existingSpans, traceGroups, schemas] = await Promise.all([
      prisma.span.findMany({ where: { spanId: { in: spanIds } } }),
      prisma.traceGroup.findMany({ where: { traceId: { in: traceIds } } }),
      prisma.schema.findMany({ where: { hash: { in: schemaHashes } } }),
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
            const createdTraceGroup = await prisma.traceGroup.create({
              data: {
                traceId: span.traceId,
              },
            });
            traceGroupId = createdTraceGroup.id;
            if (span.graphqlSchemaHash) {
              const schema = schemas.find(
                (s) => s.hash === span.graphqlSchemaHash,
              );
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
              debug("Error creating trace group", error);
              throw error;
            }
            traceGroupId = foundTraceGroup.id;
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
          },
        });
      }),
    );
  } catch (error) {
    const e = error as Error;
    debug("Error creating spans", e);
  } finally {
    debug("Worker finished");
  }
}
