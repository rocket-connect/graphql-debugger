import {
  CreateTraceInput,
  CreateTraceResponse,
  FindFirstTraceWhere,
  ListTraceGroupsWhere,
  Trace,
} from "@graphql-debugger/types";

export abstract class BaseTrace {
  constructor() {}

  public abstract findFirst({
    where,
  }: {
    where: FindFirstTraceWhere;
  }): Promise<Trace | null>;

  public abstract findMany({
    where,
    includeSpans,
    includeRootSpan,
  }: {
    where: ListTraceGroupsWhere;
    includeSpans?: boolean;
    includeRootSpan?: boolean;
  }): Promise<Trace[]>;

  public abstract createOne({
    input,
  }: {
    input: CreateTraceInput;
  }): Promise<CreateTraceResponse>;
}
