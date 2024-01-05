import { BaseSpan } from "@graphql-debugger/adapter-base";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
} from "@graphql-debugger/types";

import { ProxyAdapterOptions } from "..";
import { executeGraphQLRequest } from "../utils";

export class ProxySpan extends BaseSpan {
  public options: ProxyAdapterOptions;

  constructor(options: ProxyAdapterOptions) {
    super();
    this.options = options;
  }

  public async aggregate({
    where,
  }: {
    where: AggregateSpansWhere;
  }): Promise<AggregateSpansResponse> {
    const query = /* GraphQL */ `
      query ($where: AggregateSpansWhere!) {
        aggregateSpans(where: $where) {
          resolveCount
          errorCount
          averageDuration
          lastResolved
        }
      }
    `;

    const { data, errors } = await executeGraphQLRequest<{
      aggregateSpans: AggregateSpansResponse;
    }>({
      query,
      variables: {
        where,
      },
      url: this.options.backendUrl,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.aggregateSpans;
  }
}
