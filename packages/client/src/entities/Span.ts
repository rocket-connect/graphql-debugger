import {
  AggregateSpansResponse,
  AggregateSpansWhere,
} from "@graphql-debugger/types";

import { ClientOptions } from "../types";
import { executeGraphQLRequest } from "../utils";

export class Span {
  private clientOptions: ClientOptions;

  constructor(clientOptions: ClientOptions) {
    this.clientOptions = clientOptions;
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
      url: this.clientOptions.backendUrl as string,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.aggregateSpans;
  }
}
