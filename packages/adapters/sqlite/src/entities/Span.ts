import { BaseSpan } from "@graphql-debugger/adapter-base";
import { prisma } from "@graphql-debugger/data-access";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
} from "@graphql-debugger/types";
import { dbSpanToNetwork } from "@graphql-debugger/utils";

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
      spans: spans.map((span) => dbSpanToNetwork(span)),
    };
  }
}
