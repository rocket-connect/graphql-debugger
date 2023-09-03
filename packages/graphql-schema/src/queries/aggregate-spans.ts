import { UnixNanoTimeStamp } from '@graphql-debugger/time';
import { prisma, Span as PrismaSpan } from '@graphql-debugger/data-access';
import { builder } from '../schema';

export type AggregateSpansWhere = {
  schemaId: string;
  name: string;
};

export type AggregateSpansResponse = {
  spans: PrismaSpan[];
  resolveCount: number;
  errorCount: number;
  averageDuration: number;
  lastResolved: string;
};

export const AggregateSpansWhere = builder.inputType('AggregateSpansWhere', {
  fields: (t) => ({
    schemaId: t.string({
      required: true,
    }),
    name: t.string({
      required: true,
    }),
  }),
});

export const AggregateSpansResponse = builder.objectType('AggregateSpansResponse', {
  fields: (t) => ({
    resolveCount: t.field({
      type: 'Int',
      resolve: (root) => root.spans.length,
    }),
    errorCount: t.field({
      type: 'Int',
      resolve: (root) => {
        return root.spans.filter((s) => s.errorMessage || s.errorStack).length;
      },
    }),
    averageDuration: t.field({
      type: 'String',
      resolve: (root) => {
        if (root.spans.length === 0) {
          return '0';
        }

        const durations = root.spans.map((s) => new UnixNanoTimeStamp(s.durationNano));

        const average = UnixNanoTimeStamp.average(durations);

        return average.toString();
      },
    }),
    lastResolved: t.field({
      type: 'String',
      resolve: (root) => {
        if (root.spans.length === 0) {
          return '0';
        }

        const timestamps = root.spans.map((s) => new UnixNanoTimeStamp(s.endTimeUnixNano));

        const max = UnixNanoTimeStamp.latest(timestamps);

        return max.toString();
      },
    }),
  }),
});

builder.queryField('aggregateSpans', (t) =>
  t.field({
    type: AggregateSpansResponse,
    args: {
      where: t.arg({
        type: AggregateSpansWhere,
        required: true,
      }),
    },
    resolve: async (root, args) => {
      const spans = await prisma.span.findMany({
        where: {
          traceGroup: {
            schemaId: args.where.schemaId,
          },
          name: args.where.name,
        },
      });

      return {
        resolveCount: 0,
        errorCount: 0,
        averageDuration: 0,
        lastResolved: '0',
        spans,
      };
    },
  })
);
