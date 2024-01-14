import { BaseSpan } from "@graphql-debugger/adapter-base";
import { SpanFragment } from "@graphql-debugger/graphql-fragments";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  CreateSpanInput,
  CreateSpanResponse,
  DeleteSpanResponse,
  DeleteSpanWhere,
  ListSpansResponse,
  ListSpansWhere,
} from "@graphql-debugger/types";

import { executeGraphQLRequest } from "../utils";

export class ProxySpan extends BaseSpan {
  private apiURL: string;

  constructor({ apiURL }: { apiURL: string }) {
    super();
    this.apiURL = apiURL;
  }

  public async findMany({
    where,
  }: {
    where: ListSpansWhere;
  }): Promise<ListSpansResponse> {
    const query = /* GraphQL */ `
      query ($where: ListSpansWhere!) {
        listSpans(where: $where) {
          spans {
            ...SpanFragment
          }
        }
      }

      ${SpanFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<{
      listSpans: ListSpansResponse;
    }>({
      query,
      variables: {
        where,
      },
      url: this.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.listSpans;
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
      url: this.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.aggregateSpans;
  }

  public async createOne({
    input,
  }: {
    input: CreateSpanInput;
  }): Promise<CreateSpanResponse> {
    const query = /* GraphQL */ `
      mutation ($input: CreateSpanInput!) {
        createSpan(input: $input) {
          span {
            ...SpanFragment
          }
        }
      }

      ${SpanFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<{
      createSpan: CreateSpanResponse;
    }>({
      query,
      variables: {
        input,
      },
      url: this.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.createSpan;
  }

  public async deleteOne({
    where,
  }: {
    where: DeleteSpanWhere;
  }): Promise<DeleteSpanResponse> {
    const query = /* GraphQL */ `
      mutation ($where: DeleteSpanWhere!) {
        deleteSpan(where: $where) {
          success
        }
      }
    `;

    const { data, errors } = await executeGraphQLRequest<{
      deleteSpan: DeleteSpanResponse;
    }>({
      query,
      variables: {
        where,
      },
      url: this.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.deleteSpan;
  }
}
