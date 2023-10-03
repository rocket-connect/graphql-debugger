import { ListTraceGroupsWhere, Trace } from "@graphql-debugger/types";

import { executeGraphQLRequest } from "./executeGraphQLRequest";
import type {
  ListTraceGroupsDataResponse,
  ListTraceGroupsVariables,
} from "./types";

const ListTraceGroupsQuery = /* GraphQL */ `
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
    errorMessage
    errorStack
    endTimeUnixNano
    startTimeUnixNano
    durationNano
    graphqlDocument
    graphqlVariables
    graphqlResult
    graphqlContext
  }
`;

export async function listTraceGroups({
  where,
  includeSpans = false,
  includeRootSpan = false,
}: ListTraceGroupsVariables = {}): Promise<Trace[]> {
  const { data, errors } = await executeGraphQLRequest<
    ListTraceGroupsDataResponse,
    ListTraceGroupsVariables
  >({
    query: ListTraceGroupsQuery,
    variables: {
      where,
      includeSpans,
      includeRootSpan,
    },
  });

  if (errors && errors?.length > 0) {
    console.error(new Error(errors.map((e) => e.message).join("\n")));
    return [];
  }

  return data.listTraceGroups.traces;
}

export async function getTraceGroup(id: string): Promise<Trace> {
  const traceGroups = await listTraceGroups({
    where: {
      id,
    },
  });

  const traceGroup = traceGroups.find((t) => t.id === id);

  if (!traceGroup) {
    throw new Error(`Trace group with id ${id} not found`);
  }

  return traceGroup;
}
