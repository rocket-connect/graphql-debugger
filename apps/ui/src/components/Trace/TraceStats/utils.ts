import { Span } from "@graphql-debugger/types";

export type RenderTree = Omit<Span, "__typename"> & {
  children: RenderTree[];
};

const sortSpansByStartTime = (a: RenderTree, b: RenderTree): number => {
  return Number(BigInt(a.startTimeUnixNano) - BigInt(b.startTimeUnixNano));
};

const sortTreeDataRecursively = (tree: RenderTree[]): RenderTree[] => {
  for (const span of tree) {
    if (span.children.length > 0) {
      span.children = sortTreeDataRecursively(span.children);
    }
  }
  return tree.sort(sortSpansByStartTime);
};

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
      isForeign: span.isForeign,
      attributes: span.attributes as string,
    };
  });

  spanArray.forEach((span) => {
    if (span.parentSpanId) {
      lookup[span.parentSpanId]?.children?.push(lookup[span.spanId]);
    } else {
      treeData.push(lookup[span.spanId]);
    }
  });

  return sortTreeDataRecursively(treeData);
};
