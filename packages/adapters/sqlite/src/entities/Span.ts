import { BaseSpan } from "@graphql-debugger/adapter-base";
import { prisma } from "@graphql-debugger/data-access";
import { TimeStamp, UnixNanoTimeStamp } from "@graphql-debugger/time";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
} from "@graphql-debugger/types";

export class SQLiteSpan extends BaseSpan {
  constructor() {
    super();
  }

  public async aggregate({
    where,
  }: {
    where: AggregateSpansWhere;
  }): Promise<AggregateSpansResponse> {
    const spans = await prisma.span.findMany({
      where: {
        traceGroup: {
          schemaId: where.schemaId,
        },
        name: where.name,
      },
    });

    return {
      resolveCount: 0,
      errorCount: 0,
      averageDuration: "0",
      lastResolved: "0",
      spans: spans.map((span) => {
        return {
          id: span.id,
          spanId: span.spanId,
          parentSpanId: span.parentSpanId as string,
          traceId: span.traceId,
          name: span.name as string,
          kind: span.kind,
          startTimeUnixNano: new UnixNanoTimeStamp(
            span.startTimeUnixNano,
          ).toString(),
          endTimeUnixNano: new UnixNanoTimeStamp(
            span.endTimeUnixNano,
          ).toString(),
          durationNano: new UnixNanoTimeStamp(span.durationNano).toString(),
          graphqlDocument: span.graphqlDocument,
          graphqlVariables: span.graphqlVariables,
          graphqlResult: span.graphqlResult,
          graphqlContext: span.graphqlContext,
          timestamp: 0,
          createdAt: new TimeStamp(span.createdAt).toString(),
          updatedAt: new TimeStamp(span.updatedAt).toString(),
          errorMessage: span.errorMessage,
          errorStack: span.errorStack,
          isForeign: span.isForeign,
          attributes: span.attributes as string,
        };
      }),
    };
  }
}
