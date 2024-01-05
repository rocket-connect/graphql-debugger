import {
  AggregateSpansResponse,
  AggregateSpansWhere,
} from "@graphql-debugger/types";

export abstract class BaseSpan {
  constructor() {}

  public abstract aggregate({
    where,
  }: {
    where: AggregateSpansWhere;
  }): Promise<AggregateSpansResponse>;
}
