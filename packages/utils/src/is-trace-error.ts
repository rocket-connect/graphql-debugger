import { Span, TraceGroup } from "@graphql-debugger/data-access";

export function isSpanError(span: Span): boolean {
  return Boolean(span.errorMessage || span.errorStack);
}

export function isTraceError(trace: TraceGroup & { spans: Span[] }): boolean {
  return trace.spans.some((span) => isSpanError(span));
}
