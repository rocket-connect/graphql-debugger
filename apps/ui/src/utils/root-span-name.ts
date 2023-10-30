import { Trace } from "@graphql-debugger/types";

export function rootSpanName({ trace }: { trace: Trace }): string {
  if (
    trace.rootSpan?.graphqlOperationName &&
    trace.rootSpan?.graphqlOperationType
  ) {
    return `${trace.rootSpan.graphqlOperationType} ${trace.rootSpan.graphqlOperationName}`;
  } else {
    return trace?.rootSpan?.name || "";
  }
}
