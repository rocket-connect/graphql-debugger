import { prisma } from '../../prisma';
import { builder } from '../schema';
import { Span, SpanObject } from './span';

export type Trace = {
  id: string;
  traceId: string;
  spans: Span[];
  rootSpan?: Span;
};

export const TraceObject = builder.objectType('Trace', {
  fields: (t) => ({
    id: t.exposeString('id'),
    traceId: t.exposeString('traceId'),
    rootSpan: t.field({
      type: SpanObject,
      nullable: true,
      resolve: async (root, args, context) => {
        const span = await context.loaders.rootSpanLoader.load(root.id);

        return span;
      },
    }),
    spans: t.field({
      type: [SpanObject],
      resolve: async (root, args, context) => {
        const spans = await context.loaders.spanLoader.load(root.id);

        return spans.reduce<Span[]>((list, span) => {
          // collapse duplicate spans and add together, this is for graphql field resolvers and n+1
          const groupSpan = list.find(
            (s) => s.name === span.name && s.parentSpanId === span.parentSpanId
          );

          if (groupSpan) {
            const spanStartTime = span.startTimeUnixNano;
            const spanEndTime = span.endTimeUnixNano;

            groupSpan.startTimeUnixNano =
              groupSpan.startTimeUnixNano > spanStartTime
                ? spanStartTime.toString()
                : groupSpan.startTimeUnixNano;

            groupSpan.endTimeUnixNano =
              groupSpan.endTimeUnixNano < spanEndTime
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
      },
    }),
  }),
});
