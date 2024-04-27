import gql from "gql-tag";

export const SpanFragment = gql`
  fragment SpanFragment on Span {
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
    graphqlOperationName
    graphqlOperationType
    createdAt
    updatedAt
    isForeign
    isGraphQLRootSpan
    attributes
  }
`;
