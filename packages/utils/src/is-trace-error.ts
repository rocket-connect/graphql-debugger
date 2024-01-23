import { Span, Trace } from "@graphql-debugger/types";

export function isSpanError(span: Span): boolean {
  return Boolean(span.errorMessage || span.errorStack);
}

export function isTraceError(trace: Trace & { spans: Span[] }): boolean {
  return trace.spans.some((span) => isSpanError(span));
}
