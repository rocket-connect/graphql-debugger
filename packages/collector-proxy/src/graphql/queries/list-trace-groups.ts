import { prisma } from '../../prisma';
import { Span } from '../objects/span';
import { Trace, TraceObject } from '../objects/trace';
import { builder } from '../schema';

export type ListTraceGroupsResponse = {
  traces: Trace[];
};

export const ListTraceGroupsResponse = builder.objectType('ListTraceGroupsResponse', {
  fields: (t) => ({
    traces: t.expose('traces', {
      type: [TraceObject],
    }),
  }),
});

builder.queryField('listTraceGroups', (t) =>
  t.field({
    type: ListTraceGroupsResponse,
    resolve: async (root, args) => {
      const traces = await prisma.traceGroup.findMany({
        select: { id: true, traceId: true, spans: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      });

      return {
        traces: traces.map((trace) => {
          const spans = trace.spans.reduce<Span[]>((list, span) => {
            // collapse duplicate spans and add together, this is for graphql field resolvers and n+1
            const groupSpan = list.find(
              (s) => s.name === span.name && s.parentSpanId === span.parentSpanId
            );

            if (groupSpan) {
              const spanStartTime = span.startTimeUnixNano;
              const spanEndTime = span.endTimeUnixNano;

              groupSpan.startTimeUnixNano =
                BigInt(groupSpan.startTimeUnixNano) > spanStartTime
                  ? spanStartTime.toString()
                  : groupSpan.startTimeUnixNano;

              groupSpan.endTimeUnixNano =
                BigInt(groupSpan.endTimeUnixNano) < spanEndTime
                  ? spanEndTime.toString()
                  : groupSpan.endTimeUnixNano;

              return list;
            } else {
              return [
                ...list,
                {
                  id: span.id,
                  spanId: span.spanId,
                  parentSpanId: span.parentSpanId,
                  traceId: span.traceId,
                  name: span.name,
                  kind: span.kind,
                  startTimeUnixNano: span.startTimeUnixNano.toString(),
                  endTimeUnixNano: span.endTimeUnixNano.toString(),
                  attributes: span.attributes,
                  duration: 0,
                  timestamp: 0,
                  createdAt: span.createdAt.toString(),
                  updatedAt: span.updatedAt.toString(),
                },
              ];
            }
          }, []);

          return {
            id: trace.id,
            traceId: trace.traceId,
            spans,
          };
        }),
      };
    },
  })
);
