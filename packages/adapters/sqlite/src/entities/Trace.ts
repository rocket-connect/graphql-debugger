import { BaseTrace } from "@graphql-debugger/adapter-base";
import { prisma } from "@graphql-debugger/data-access";
import {
  FindFirstTraceWhere,
  ListTraceGroupsWhere,
  Trace,
} from "@graphql-debugger/types";

export class SQLiteTrace extends BaseTrace {
  constructor() {
    super();
  }

  public async findFirst({
    where,
  }: {
    where: FindFirstTraceWhere;
  }): Promise<Trace | null> {
    const trace = await prisma.traceGroup.findFirst({
      where: {
        traceId: where.traceId,
      },
    });

    if (!trace) {
      return null;
    }

    return {
      id: trace.id,
      traceId: trace.traceId,
      spans: [],
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
}
