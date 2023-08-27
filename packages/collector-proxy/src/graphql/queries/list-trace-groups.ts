import { prisma } from '../../prisma';
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
      });

      return {
        traces: traces.map((trace) => ({
          id: trace.id,
          traceId: trace.traceId,
          spans: trace.spans.map((span) => ({
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
          })),
        })),
      };
    },
  })
);
