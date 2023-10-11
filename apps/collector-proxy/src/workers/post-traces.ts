import { prisma } from "@graphql-debugger/data-access";
import { extractSpans } from "@graphql-debugger/opentelemetry";
import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import {
  AttributeNames,
  ExtractedSpan,
  PostTraces,
} from "@graphql-debugger/types";

import { debug } from "../debug";
import { foreignTracesQueue } from "../index";

export async function postTracesWorker(data: PostTraces["body"]) {
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

    const [existingSpans, traceGroups, schemas] = await Promise.all([
      prisma.span.findMany({ where: { spanId: { in: spanIds } } }),
      prisma.traceGroup.findMany({ where: { traceId: { in: traceIds } } }),
      prisma.schema.findMany({ where: { hash: { in: schemaHashes } } }),
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
            graphqlSchemaHash: span.graphqlSchemaHash,
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
}
