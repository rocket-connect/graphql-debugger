import { ListTraceGroupsResponse } from "@graphql-debugger/types";

export function isSpanError(
  span: ListTraceGroupsResponse["traces"][0]["spans"][0],
): boolean {
  return Boolean(span.errorStack || span.errorMessage);
}

export function isTraceError(
  tracegroup: ListTraceGroupsResponse["traces"][0],
): boolean {
  const isError =
    (tracegroup.spans || []).some((span) => {
      return isSpanError(span);
    }) ||
    (tracegroup.rootSpan ? Boolean(isSpanError(tracegroup.rootSpan)) : false);

  return isError;
}
