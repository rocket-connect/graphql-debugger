import { builder } from '../schema';
import { Span, SpanObject } from './span';

export type Trace = {
  id: string;
  traceId: string;
  spans: Span[];
  rootSpan?: Span;
  firstSpanErrorMessage?: string;
  firstSpanErrorStack?: string;
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
    firstSpanErrorMessage: t.field({
      type: 'String',
      nullable: true,
      resolve: async (root, args, context) => {
        const spans = await context.loaders.spanLoader.load(root.id);

        return spans.find((span) => span.errorMessage !== null)?.errorMessage;
      },
    }),
    firstSpanErrorStack: t.field({
      type: 'String',
      nullable: true,
      resolve: async (root, args, context) => {
        const spans = await context.loaders.spanLoader.load(root.id);

        return spans.find((span) => span.errorMessage !== null)?.errorMessage;
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
            const spanStartTime = BigInt(span.startTimeUnixNano);
            const spanEndTime = BigInt(span.endTimeUnixNano);

            groupSpan.startTimeUnixNano =
              groupSpan.startTimeUnixNano > spanStartTime
                ? spanStartTime
                : groupSpan.startTimeUnixNano;

            groupSpan.endTimeUnixNano =
              groupSpan.endTimeUnixNano < spanEndTime ? spanEndTime : groupSpan.endTimeUnixNano;

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
                startTimeUnixNano: span.startTimeUnixNano,
                endTimeUnixNano: span.endTimeUnixNano,
                durationNano: span.durationNano,
                graphqlDocument: span.graphqlDocument,
                graphqlVariables: span.graphqlVariables,
                timestamp: 0,
                createdAt: span.createdAt.toString(),
                updatedAt: span.updatedAt.toString(),
                errorMessage: span.errorMessage,
                errorStack: span.errorStack,
              },
            ];
          }
        }, []);
      },
    }),
  }),
});
