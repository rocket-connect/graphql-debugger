import { graphql } from "@graphql-debugger/types";
import { api } from "./api";

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
}: {
  where?: graphql.ListTraceGroupsWhere;
  includeSpans?: boolean;
  includeRootSpan?: boolean;
} = {}): Promise<graphql.Trace[]> {
  const { data, errors } = await api<{
    listTraceGroups: graphql.Query["listTraceGroups"];
  }>({
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

export async function getTraceGroup(id: string): Promise<graphql.Trace> {
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
