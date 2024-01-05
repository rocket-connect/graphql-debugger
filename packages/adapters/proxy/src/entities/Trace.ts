import { BaseTrace } from "@graphql-debugger/adapter-base";
import { ListTraceGroupsWhere, Trace } from "@graphql-debugger/types";

import { ProxyAdapterOptions } from "..";
import { executeGraphQLRequest } from "../utils";

export class ProxyTrace extends BaseTrace {
  public options: ProxyAdapterOptions;

  constructor(options: ProxyAdapterOptions) {
    super();
    this.options = options;
  }

  public async findMany({
    where,
    includeSpans,
    includeRootSpan,
  }: {
    where: ListTraceGroupsWhere;
    includeSpans?: boolean;
    includeRootSpan?: boolean;
  }): Promise<Trace[]> {
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
}
