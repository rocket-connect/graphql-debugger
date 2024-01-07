import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  CreateSpanInput,
  CreateSpanResponse,
  ListSpansResponse,
  ListSpansWhere,
} from "@graphql-debugger/types";

export abstract class BaseSpan {
  constructor() {}

  public abstract findMany({
    where,
  }: {
    where: ListSpansWhere;
  }): Promise<ListSpansResponse>;

  public abstract aggregate({
    where,
  }: {
    where: AggregateSpansWhere;
  }): Promise<AggregateSpansResponse>;

  public abstract createOne({
    input,
  }: {
    input: CreateSpanInput;
  }): Promise<CreateSpanResponse>;
}
