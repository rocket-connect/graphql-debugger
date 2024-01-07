import { BaseSpan } from "@graphql-debugger/adapter-base";
import { prisma } from "@graphql-debugger/data-access";
import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  CreateSpanInput,
  CreateSpanResponse,
  ListSpansResponse,
  ListSpansWhere,
} from "@graphql-debugger/types";
import { dbSpanToNetwork } from "@graphql-debugger/utils";

export class SQLiteSpan extends BaseSpan {
  constructor() {
    super();
  }

  public async findMany({
    where,
  }: {
    where: ListSpansWhere;
  }): Promise<ListSpansResponse> {
    let _where = {};
    if (where.spanIds) {
      _where = { ...where, ...{ spanId: { in: where.spanIds } } };
    }
    const spans = await prisma.span.findMany({
      where: _where,
    });

    return {
      spans: spans.map((span) => dbSpanToNetwork(span)),
    };
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

  public async createOne({
    input,
  }: {
    input: CreateSpanInput;
  }): Promise<CreateSpanResponse> {
    const startTimeUnixNano = UnixNanoTimeStamp.fromString(
      input.startTimeUnixNano,
    );
    const endTimeUnixNano = UnixNanoTimeStamp.fromString(input.endTimeUnixNano);
    const durationNano = UnixNanoTimeStamp.duration(
      startTimeUnixNano,
      endTimeUnixNano,
    );

    const span = await prisma.span.create({
      data: {
        spanId: input.spanId,
        parentSpanId: input.parentSpanId,
        name: input.name,
        kind: input.kind.toString(),
        startTimeUnixNano: startTimeUnixNano.toStorage(),
        endTimeUnixNano: endTimeUnixNano.toStorage(),
        durationNano: durationNano.toStorage(),
        traceId: input.traceId,
        traceGroupId: input.traceGroupId,
        errorMessage: input.errorMessage,
        errorStack: input.errorStack,
        graphqlDocument: input.graphqlDocument,
        graphqlVariables: input.graphqlVariables,
        graphqlResult: input.graphqlResult,
        graphqlContext: input.graphqlContext,
        graphqlSchemaHash: input.graphqlSchemaHash,
        graphqlOperationName: input.graphqlOperationName,
        graphqlOperationType: input.graphqlOperationType,
        isForeign: input.isForeign || false,
        isGraphQLRootSpan: input.isGraphQLRootSpan || false,
        attributes: JSON.stringify(input.attributes),
      },
    });

    return {
      span: dbSpanToNetwork(span),
    };
  }
}
