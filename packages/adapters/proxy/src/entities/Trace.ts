import { BaseTrace } from "@graphql-debugger/adapter-base";
import {
  SpanFragment,
  TraceFragment,
} from "@graphql-debugger/graphql-fragments";
import {
  CreateTraceInput,
  CreateTraceResponse,
  FindFirstTraceOptions,
  FindFirstTraceResponse,
  FindFirstTraceWhere,
  ListTraceGroupsWhere,
  Span,
  Trace,
  UpdateTraceInput,
  UpdateTraceResponse,
  UpdateTraceWhere,
} from "@graphql-debugger/types";

import { ProxyAdapterOptions } from "..";
import { executeGraphQLRequest } from "../utils";

export class ProxyTrace extends BaseTrace {
  public options: ProxyAdapterOptions;

  constructor(options: ProxyAdapterOptions) {
    super();
    this.options = options;
  }

  public async findFirst({
    where,
    options,
  }: {
    where: FindFirstTraceWhere;
    options?: FindFirstTraceOptions;
  }): Promise<Trace | null> {
    const query = /* GraphQL */ `
      query ($where: FindFirstTraceWhere!) {
        findFirstTrace(where: $where) {
          trace {
            id
            traceId
            ${
              options?.includeSpans
                ? /* GraphQL */ `
                  spans { 
                    ...SpanFragment
                  }
                  rootSpan {
                    ...SpanFragment
                  }
                `
                : ""
            }
          }
        }
      }

      ${SpanFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<
      {
        findFirstTrace: FindFirstTraceResponse;
      },
      {
        where: FindFirstTraceWhere;
      }
    >({
      query,
      variables: {
        where,
      },
      url: this.options.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    if (!data.findFirstTrace?.trace) {
      return null;
    }

    return data.findFirstTrace.trace;
  }

  public async findMany({
    where,
    includeSpans,
    includeRootSpan,
  }: {
    where: ListTraceGroupsWhere;
    includeSpans?: boolean;
    includeRootSpan?: boolean;
  }): Promise<(Trace & { spans: Span[] })[]> {
    const query = /* GraphQL */ `
      query (
        $where: ListTraceGroupsWhere
        $includeSpans: Boolean = false
        $includeRootSpan: Boolean = false
      ) {
        listTraceGroups(where: $where) {
          traces {
            ...TraceFragment
            spans @include(if: $includeSpans) {
              ...SpanFragment
            }
            rootSpan @include(if: $includeRootSpan) {
              ...SpanFragment
            }
          }
        }
      }

      ${TraceFragment}
      ${SpanFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<
      {
        listTraceGroups: {
          traces: Trace[];
        };
      },
      {
        where: ListTraceGroupsWhere;
        includeSpans?: boolean;
        includeRootSpan?: boolean;
      }
    >({
      query,
      variables: {
        where,
        includeSpans,
        includeRootSpan,
      },
      url: this.options.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.listTraceGroups.traces;
  }

  public async createOne({
    input,
  }: {
    input: CreateTraceInput;
  }): Promise<CreateTraceResponse> {
    const query = /* GraphQL */ `
      mutation ($input: CreateTraceInput!) {
        createTrace(input: $input) {
          trace {
            ...TraceFragment
          }
        }
      }

      ${TraceFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<
      {
        createTrace: CreateTraceResponse;
      },
      {
        input: CreateTraceInput;
      }
    >({
      query,
      variables: {
        input,
      },
      url: this.options.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.createTrace;
  }

  public async updateOne({
    where,
    input,
  }: {
    where: UpdateTraceWhere;
    input: UpdateTraceInput;
  }): Promise<UpdateTraceResponse> {
    const query = /* GraphQL */ `
      mutation ($where: UpdateTraceWhere!, $input: UpdateTraceInput!) {
        updateTrace(where: $where, input: $input) {
          trace {
            ...TraceFragment
          }
        }
      }

      ${TraceFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<
      {
        updateTrace: UpdateTraceResponse;
      },
      {
        where: UpdateTraceWhere;
        input: UpdateTraceInput;
      }
    >({
      query,
      variables: {
        where,
        input,
      },
      url: this.options.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.updateTrace;
  }
}
