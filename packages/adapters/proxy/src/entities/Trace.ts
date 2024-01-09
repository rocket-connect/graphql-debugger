import { BaseTrace } from "@graphql-debugger/adapter-base";
import {
  CreateTraceInput,
  CreateTraceResponse,
  FindFirstTraceOptions,
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
      query ($where: FindFirstTraceWhere, $options: FindFirstTraceOptions) {
        findFirstTrace(where: $where, options: $options) {
          id
          traceId
        }
      }
    `;

    const { data, errors } = await executeGraphQLRequest<
      {
        findFirstTrace: Trace | null;
      },
      {
        where: FindFirstTraceWhere;
        options?: FindFirstTraceOptions;
      }
    >({
      query,
      variables: {
        where,
        options,
      },
      url: this.options.backendUrl,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.findFirstTrace;
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
            id
            traceId
            firstSpanErrorMessage
            firstSpanErrorStack
            spans @include(if: $includeSpans) {
              ...SpanObject
            }
            rootSpan @include(if: $includeRootSpan) {
              ...SpanObject
            }
          }
        }
      }

      fragment SpanObject on Span {
        id
        spanId
        traceId
        parentSpanId
        name
        kind
        isForeign
        attributes
        errorMessage
        errorStack
        endTimeUnixNano
        startTimeUnixNano
        durationNano
        graphqlDocument
        graphqlVariables
        graphqlResult
        graphqlContext
        graphqlOperationName
        graphqlOperationType
      }
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
      url: this.options.backendUrl,
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
            id
            traceId
          }
        }
      }
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
      url: this.options.backendUrl,
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
            id
            traceId
          }
        }
      }
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
      url: this.options.backendUrl,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.updateTrace;
  }
}
