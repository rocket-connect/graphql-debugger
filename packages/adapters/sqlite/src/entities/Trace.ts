import { BaseTrace } from "@graphql-debugger/adapter-base";
import { prisma } from "@graphql-debugger/data-access";
import { ListTraceGroupsWhere, Trace } from "@graphql-debugger/types";

export class SQLiteTrace extends BaseTrace {
  constructor() {
    super();
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
