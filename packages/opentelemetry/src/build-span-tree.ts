import { ReadableSpan } from "@opentelemetry/sdk-trace-base";

export type SpanTree = {
  span: ReadableSpan;
  children: SpanTree[];
};

export function buildSpanTree(tree: SpanTree, spans: ReadableSpan[]): SpanTree {
  const childrenSpans = spans.filter(
    (span) => span.parentSpanId === tree.span.spanContext().spanId,
  );

  if (childrenSpans.length) {
    tree.children = childrenSpans.map((span) =>
      buildSpanTree({ span, children: [] }, spans),
    );
  } else {
    tree.children = [];
  }

  const simpleTree = JSON.stringify(
    tree,
    (key, value) => {
      const removedKeys = [
        "endTime",
        "startTime",
        "_spanLimits",
        "instrumentationLibrary",
        "_spanProcessor",
        "_attributeValueLengthLimit",
        "_duration",
      ];

      if (removedKeys.includes(key)) {
        return undefined;
      } else {
        return value;
      }
    },
    2,
  );

  return JSON.parse(simpleTree);
}
