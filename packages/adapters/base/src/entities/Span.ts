import {
  AggregateSpansResponse,
  AggregateSpansWhere,
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
}
