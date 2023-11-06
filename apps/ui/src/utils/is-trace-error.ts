import type { Span, Trace } from "@graphql-debugger/types";

export function isSpanError(span: Span): boolean {
  return Boolean(span.errorStack || span.errorMessage);
}

export function isTraceError(tracegroup: Trace): boolean {
  const isError =
    (tracegroup.spans || []).some((span) => {
      return isSpanError(span);
    }) ||
    (tracegroup.rootSpan ? Boolean(isSpanError(tracegroup.rootSpan)) : false);

  return isError;
}
