import { builder } from '../schema';
import { Span, SpanObject } from './span';

export type Trace = {
  id: string;
  traceId: string;
  spans: Span[];
};

export const TraceObject = builder.objectType('Trace', {
  fields: (t) => ({
    id: t.exposeString('id'),
    traceId: t.exposeString('traceId'),
    spans: t.expose('spans', {
      type: [SpanObject],
    }),
  }),
});
