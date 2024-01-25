import gql from "gql-tag";

export const TraceFragment = gql`
  fragment TraceFragment on Trace {
    id
    traceId
    schemaId
    firstSpanErrorMessage
    firstSpanErrorStack
    firstSpanErrorMessage
    firstSpanErrorStack
  }
`;
