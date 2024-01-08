import { BaseTrace } from "@graphql-debugger/adapter-base";
import { prisma } from "@graphql-debugger/data-access";
import {
  CreateTraceInput,
  CreateTraceResponse,
  FindFirstTraceOptions,
  FindFirstTraceWhere,
  ListTraceGroupsWhere,
  Trace,
  UpdateTraceInput,
  UpdateTraceResponse,
  UpdateTraceWhere,
} from "@graphql-debugger/types";
import { dbSpanToNetwork } from "@graphql-debugger/utils";

export class SQLiteTrace extends BaseTrace {
  constructor() {
    super();
  }

  public async findFirst({
    where,
    options,
  }: {
    where: FindFirstTraceWhere;
    options?: FindFirstTraceOptions;
  }): Promise<Trace | null> {
    const trace = await prisma.traceGroup.findFirst({
      where: {
        traceId: where.traceId,
      },
      include: {
        ...(options?.includeSpans
          ? {
              spans: true,
            }
          : {}),
      },
    });

    if (!trace) {
      return null;
    }

    return {
      id: trace.id,
      traceId: trace.traceId,
      ...(options?.includeSpans
        ? {
            spans: trace?.spans?.map((span) => {
              return dbSpanToNetwork(span);
            }),
          }
        : {
            spans: [],
          }),
    };
  }

  public async findMany(args: {
    where: ListTraceGroupsWhere;
    includeSpans?: boolean;
    includeRootSpan?: boolean;
  }): Promise<Trace[]> {
    const whereConditions: any = [
      {
        spans: {
          some: {
            isGraphQLRootSpan: true,
          },
        },
      },
    ];

    if (args.where?.id) {
      whereConditions.push({ id: args.where.id });
    }

    if (args.where?.schemaId) {
      whereConditions.push({ schemaId: args.where.schemaId });
    }

    if (args.where?.rootSpanName) {
      whereConditions.push({
        spans: {
          some: {
            name: {
              equals: args.where.rootSpanName,
            },
          },
        },
      });
    }

    if (args.where?.traceIds) {
      whereConditions.push({ traceId: { in: args.where.traceIds } });
    }

    const where = {
      AND: whereConditions,
    };

    const traces = await prisma.traceGroup.findMany({
      orderBy: { createdAt: "desc" },
      where,
      take: 20,
    });

    return traces.map((trace) => {
      return {
        id: trace.id,
        traceId: trace.traceId,
        spans: [],
      };
    });
  }

  public async createOne({
    input,
  }: {
    input: CreateTraceInput;
  }): Promise<CreateTraceResponse> {
    const trace = await prisma.traceGroup.create({
      data: {
        traceId: input.traceId,
      },
    });

    return {
      trace: {
        id: trace.id,
        traceId: trace.traceId,
        spans: [],
      },
    };
  }

  public async updateOne({
    where,
    input,
  }: {
    where: UpdateTraceWhere;
    input: UpdateTraceInput;
  }): Promise<UpdateTraceResponse> {
    const trace = await prisma.traceGroup.update({
      where: {
        id: where.id,
      },
      data: {
        schemaId: input.schemaId,
      },
    });

    return {
      trace: {
        id: trace.id,
        traceId: trace.traceId,
        spans: [],
      },
    };
  }
}
