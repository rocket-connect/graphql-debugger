import { builder } from '../schema';
import type { Span as PrismaSpan } from '.prisma/client';

export type Span = {
  id: PrismaSpan['id'];
  spanId: PrismaSpan['spanId'];
  parentSpanId: PrismaSpan['parentSpanId'];
  traceId: PrismaSpan['traceId'];
  name: PrismaSpan['name'];
  kind: PrismaSpan['kind'];
  duration: number;
  timestamp: number;
  startTimeUnixNano: string;
  endTimeUnixNano: string;
  attributes: string;
  createdAt: string;
  updatedAt: string;
};

export const SpanObject = builder.objectType('Span', {
  fields: (t) => ({
    id: t.exposeID('id'),
    spanId: t.exposeString('spanId'),
    parentSpanId: t.exposeString('parentSpanId', { nullable: true }),
    traceId: t.exposeString('traceId'),
    name: t.exposeString('name'),
    kind: t.exposeString('kind'),
    startTimeUnixNano: t.exposeString('startTimeUnixNano'),
    timestamp: t.field({
      type: 'Float',
      resolve: (root) => {
        const startTime = BigInt(root.startTimeUnixNano);
        const timestamp = Number(startTime / BigInt(1000000));

        return timestamp;
      },
    }),
    duration: t.field({
      type: 'Float',
      resolve: (root) => {
        const startTime = BigInt(root.startTimeUnixNano);
        const endTime = BigInt(root.endTimeUnixNano);
        const duration = Number((endTime - startTime) / BigInt(1000000));

        return duration;
      },
    }),
    endTimeUnixNano: t.exposeString('endTimeUnixNano'),
    attributes: t.exposeString('attributes'),
    createdAt: t.exposeString('createdAt'),
    updatedAt: t.exposeString('updatedAt'),
  }),
});
