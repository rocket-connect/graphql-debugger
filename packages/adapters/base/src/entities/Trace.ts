import {
  CreateTraceInput,
  CreateTraceResponse,
  FindFirstTraceOptions,
  FindFirstTraceWhere,
  ListTraceGroupsWhere,
  Trace,
  UpdateTraceInput,
  UpdateTraceResponse,
  UpdateTraceWhere,
} from "@graphql-debugger/types";

export abstract class BaseTrace {
  constructor() {}

  public abstract findFirst({
    where,
  }: {
    where: FindFirstTraceWhere;
    options?: FindFirstTraceOptions;
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

  public abstract updateOne({
    where,
    input,
  }: {
    where: UpdateTraceWhere;
    input: UpdateTraceInput;
  }): Promise<UpdateTraceResponse>;
}
