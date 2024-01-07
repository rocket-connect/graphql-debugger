import { BaseSpan } from "@graphql-debugger/adapter-base";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  CreateSpanInput,
  CreateSpanResponse,
  ListSpansResponse,
  ListSpansWhere,
} from "@graphql-debugger/types";

import { ProxyAdapterOptions } from "..";
import { executeGraphQLRequest } from "../utils";

export class ProxySpan extends BaseSpan {
  public options: ProxyAdapterOptions;

  constructor(options: ProxyAdapterOptions) {
    super();
    this.options = options;
  }

  public async findMany({
    where,
  }: {
    where: ListSpansWhere;
  }): Promise<ListSpansResponse> {
    const query = /* GraphQL */ `
      query ($where: ListSpansWhere!) {
        listSpans(where: $where) {
          id
          spanId
          parentSpanId
          traceId
          name
          kind
          startTimeUnixNano
          endTimeUnixNano
          durationNano
          graphqlDocument
          graphqlVariables
          graphqlResult
          graphqlContext
          graphqlOperationName
          graphqlOperationType
          createdAt
          updatedAt
          errorMessage
          errorStack
          isForeign
          attributes
        }
      }
    `;

    const { data, errors } = await executeGraphQLRequest<{
      listSpans: ListSpansResponse;
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
      url: this.options.backendUrl,
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
          id
        }
      }
    `;

    const { data, errors } = await executeGraphQLRequest<{
      createSpan: CreateSpanResponse;
    }>({
      query,
      variables: {
        input,
      },
      url: this.options.backendUrl,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.createSpan;
  }
}
