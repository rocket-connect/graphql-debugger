import { ListTraceGroupsWhere, Trace } from "@graphql-debugger/types";

export abstract class BaseTrace {
  constructor() {}

  public abstract findMany({
    where,
    includeSpans,
    includeRootSpan,
  }: {
    where: ListTraceGroupsWhere;
    includeSpans?: boolean;
    includeRootSpan?: boolean;
  }): Promise<Trace[]>;
}
