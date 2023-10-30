import { Trace as TTrace } from "@graphql-debugger/types";

import {
  ClientOptions,
  ListTraceGroupsDataResponse,
  ListTraceGroupsVariables,
} from "../types";
import { executeGraphQLRequest } from "../utils";

export class Trace {
  private clientOptions: ClientOptions;

  constructor(clientOptions: ClientOptions) {
    this.clientOptions = clientOptions;
  }

  public async findMany({
    where,
    includeSpans = false,
    includeRootSpan = false,
  }: ListTraceGroupsVariables = {}): Promise<TTrace[]> {
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
      ListTraceGroupsDataResponse,
      ListTraceGroupsVariables
    >({
      query,
      variables: {
        where,
        includeSpans,
        includeRootSpan,
      },
      url: this.clientOptions.backendUrl as string,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.listTraceGroups.traces;
  }
}
