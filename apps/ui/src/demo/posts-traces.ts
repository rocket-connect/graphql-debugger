import { AttributeNames, Trace } from "@graphql-debugger/types";

import { demoSchema } from "./schema";

const postsdQueryStr = /* GraphQL */ `
  query {
    posts {
      id
      title
      content
    }
  }
`;

// Hardcoded UUIDs for consistency in demos
const postsSpanId = "6fa459ea-ee8a-3ca4-894e-db77e160355e";
const postsTraceId = "bb61b29e-8f25-4d97-a16c-76f3c9cc9dbb";
const postsTraceGroupId = "7bd7d5c3-472d-42d8-8f1e-3c2b1fda2c83";
const ormSpanId = "1ec3b03e-c9f4-4741-8cd4-6df6db8ac486";
const sqlSpanId = "aad17c5f-6484-4d1f-8b63-d0c3b4c66893";

export const postQuery: Trace = {
  id: postsTraceGroupId,
  traceId: postsTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

// Root span
postQuery.spans.push({
  id: "d22b6b2f-644f-4a62-b2c2-62fdd5a53a1f",
  spanId: postsSpanId,
  traceId: postsTraceId,
  traceGroupId: postsTraceGroupId,
  name: "query posts",
  kind: "0",
  durationNano: "1000000",
  startTimeUnixNano: "1632825750000000000",
  endTimeUnixNano: "1632825751000000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:00Z",
  updatedAt: "2023-10-01T12:00:01Z",
  isGraphQLRootSpan: true,
  graphqlOperationName: "posts",
  graphqlOperationType: "Query",
  graphqlSchemaHash: demoSchema.hash,
  attributes: JSON.stringify({
    [AttributeNames.OPERATION_NAME]: "posts",
    [AttributeNames.OPERATION_TYPE]: "Query",
    [AttributeNames.OPERATION_RETURN_TYPE]: "[Post]!",
    [AttributeNames.OPERATION_ROOT]: true,
    [AttributeNames.DOCUMENT]: postsdQueryStr,
  }),
  graphqlDocument: postsdQueryStr,
});

// Child spans simulating ORM and SQL queries, and post attributes processing
postQuery.spans.push({
  id: "f19e77c4-7f0d-422d-9332-60d7b9e67f66",
  spanId: ormSpanId,
  traceId: postsTraceId,
  parentSpanId: postsSpanId,
  traceGroupId: postsTraceGroupId,
  name: "ORM CALL",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750100000000",
  endTimeUnixNano: "1632825750600000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:01Z",
  updatedAt: "2023-10-01T12:00:01.5Z",
  attributes: JSON.stringify({
    "ORM.method": "findMany",
    "ORM.model": "post",
  }),
});

postQuery.spans.push({
  id: "b3356b0e-6b77-460a-bc3b-6ec8ab1f7835",
  spanId: sqlSpanId,
  traceId: postsTraceId,
  parentSpanId: ormSpanId,
  traceGroupId: postsTraceGroupId,
  name: "SQL Query",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750100000000",
  endTimeUnixNano: "1632825750600000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:01Z",
  updatedAt: "2023-10-01T12:00:01.5Z",
  attributes: JSON.stringify({
    "db.query": "SELECT id, title, content FROM posts",
  }),
});

// Additional hardcoded span IDs for other operations
const attributes = ["Post id", "Post title", "Post content"];
const additionalSpanIds = [
  "54ff2f25-abe9-401c-9e2a-2fab7f7c3e98",
  "981a12df-23a0-4d72-8fcc-22ab3b2a9153",
  "cffaedfe-c2a2-4a85-8dbd-bf956aed1fd8",
  "6a067e87-f16a-4b23-a8b4-d7c0beb2e41b",
];
attributes.forEach((attr, index) => {
  postQuery.spans.push({
    id: additionalSpanIds[index],
    spanId: additionalSpanIds[index] + "-span-id",
    traceId: postsTraceId,
    parentSpanId: postsSpanId, // Link to the root span
    traceGroupId: postsTraceGroupId,
    name: attr,
    kind: "0",
    durationNano: "500000",
    startTimeUnixNano: `16328257501${1000 + index}0000000`,
    endTimeUnixNano: `16328257501${1000 + index}5000000`,
    isForeign: false,
    createdAt: "2023-10-01T12:00:01Z",
    updatedAt: "2023-10-01T12:00:01.5Z",
  });
});
