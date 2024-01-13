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
          ...SpanFragment
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
      url: this.options.apiURL,
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
      url: this.options.apiURL,
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
          ...SpanFragment
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
      url: this.options.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.createSpan;
  }

  public async deleteOne({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    where,
  }: {
    where: DeleteSpanWhere;
  }): Promise<DeleteSpanResponse> {
    // TODO: implement
    return {
      success: false,
    };
  }
}
