import { Span } from 'src/graphql-types';

export type RenderTree = Omit<Span, '__typename'> & {
  children: RenderTree[];
};

export const ms = BigInt(1000000);

export const createTreeData = (spanArray: Span[]): RenderTree[] => {
  const treeData: RenderTree[] = [];
  const lookup: { [key: string]: RenderTree } = {};

  spanArray.forEach((span) => {
    lookup[span.spanId] = {
      spanId: span.spanId,
      name: span.name,
      traceId: span.traceId,
      children: [],
      startTimeUnixNano: span.startTimeUnixNano,
      endTimeUnixNano: span.endTimeUnixNano,
      durationNano: span.durationNano,
      parentSpanId: span.parentSpanId as string,
      createdAt: span.createdAt,
      kind: span.kind,
      id: span.id,
      updatedAt: span.updatedAt,
      errorMessage: span.errorMessage,
      errorStack: span.errorStack,
    };
  });

  spanArray.forEach((span) => {
    if (span.parentSpanId) {
      lookup[span.parentSpanId]?.children?.push(lookup[span.spanId]);
    } else {
      treeData.push(lookup[span.spanId]);
    }
  });

  return treeData;
};
