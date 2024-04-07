import { BaseSpan } from "@graphql-debugger/adapter-base";
import {
  AggregateSpansResponseSchema,
  CreateSpanResponseSchema,
  DeleteSpanResponseSchema,
  ListSpansResponseSchema,
} from "@graphql-debugger/schemas";
import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  CreateSpanInput,
  CreateSpanResponse,
  DeleteSpanResponse,
  DeleteSpanWhere,
  ListSpansResponse,
  ListSpansWhere,
} from "@graphql-debugger/types";
import { dbSpanToNetwork } from "@graphql-debugger/utils";

import { prisma } from "../prisma";

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
      _where = { ..._where, ...{ spanId: { in: where.spanIds } } };
    }

    if (where.traceIds) {
      _where = { ..._where, ...{ traceId: { in: where.traceIds } } };
    }

    if (where.isGraphQLRootSpan) {
      _where = { ..._where, ...{ isGraphQLRootSpan: true } };
    }

    const spans = await prisma.span.findMany({
      where: _where,
    });

    const response = {
      spans: spans.map((span) => dbSpanToNetwork(span)),
    };

    const parsed = ListSpansResponseSchema.parse(response);

    return parsed;
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

    const _spans = spans.map((span) => dbSpanToNetwork(span));

    const response = {
      resolveCount: _spans.length,
      errorCount: _spans.filter((s) => s.errorMessage || s.errorStack).length,
      averageDuration: (() => {
        if (_spans.length === 0) {
          return "0";
        }

        const durations = _spans.map(
          (s) => new UnixNanoTimeStamp(BigInt(s.durationNano)),
        );

        const average = UnixNanoTimeStamp.average(durations);

        return average.toString();
      })(),
      lastResolved: (() => {
        if (_spans.length === 0) {
          return "0";
        }

        const timestamps = _spans.map(
          (s) => new UnixNanoTimeStamp(BigInt(s.endTimeUnixNano)),
        );

        const max = UnixNanoTimeStamp.latest(timestamps);

        return max.toString();
      })(),
      spans: _spans,
    };

    const parsed = AggregateSpansResponseSchema.parse(response);

    return parsed;
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
        attributes: input.attributes,
      },
    });

    const response = {
      span: dbSpanToNetwork(span),
    };

    const parsed = CreateSpanResponseSchema.parse(response);

    return parsed;
  }

  public async deleteOne({
    where,
  }: {
    where: DeleteSpanWhere;
  }): Promise<DeleteSpanResponse> {
    await prisma.span.delete({
      where: {
        id: where.id,
      },
    });

    const response = {
      success: true,
    };

    const parsed = DeleteSpanResponseSchema.parse(response);

    return parsed;
  }
}
