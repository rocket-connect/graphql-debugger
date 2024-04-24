import { AttributeNames, Trace } from "@graphql-debugger/types";

import { demoSchema } from "./schema";

const postsdQueryStr = /* GraphQL */ `
  mutation ($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

// Hardcoded UUIDs for consistency in demos
const createPostSpanId = "378903-ee8a-3ca4-894e-db77e160355e";
const createPostTraceId = "bb61b29e-8f25-3879-a16c-76f3c9cc9dbb";
const createPostTraceGroupId = "thuio3-472d-42d8-8f1e-3c2b1fda2c83";
const ormSpanId = "1ec3b03e-c9f4-4741-8cd4-f8903r";
const sqlSpanId = "aad17c5f-6484-4d1f-8b63-3u9803";

export const createPost: Trace = {
  id: createPostTraceGroupId,
  traceId: createPostTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

// Root span
createPost.spans.push({
  id: "d22b6b2f-644f-4a62-b2c2-37837844",
  spanId: createPostSpanId,
  traceId: createPostTraceId,
  traceGroupId: createPostTraceGroupId,
  name: "mutation createPost",
  kind: "0",
  durationNano: "1000000",
  startTimeUnixNano: "1632825750000000000",
  endTimeUnixNano: "1632825751000000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:00Z",
  updatedAt: "2023-10-01T12:00:01Z",
  isGraphQLRootSpan: true,
  graphqlOperationName: "createPost",
  graphqlOperationType: "Mutation",
  graphqlSchemaHash: demoSchema.hash,
  attributes: JSON.stringify({
    [AttributeNames.OPERATION_NAME]: "createPost",
    [AttributeNames.OPERATION_TYPE]: "Mutation",
    [AttributeNames.OPERATION_RETURN_TYPE]: "Post!",
    [AttributeNames.OPERATION_ROOT]: true,
    [AttributeNames.DOCUMENT]: postsdQueryStr,
  }),
  graphqlDocument: postsdQueryStr,
  graphqlContext: JSON.stringify({
    "X-Forwarded-For": "http://localhost:3000",
    "secret-token-123": "Bearer token",
  }),
  graphqlVariables: JSON.stringify({
    title: "First post",
    content: "This is the first post",
  }),
  graphqlResult: JSON.stringify({
    data: {
      id: "1",
      title: "First post",
      content: "This is the first post",
    },
  }),
});

// Child spans simulating ORM and SQL queries, and post attributes processing
createPost.spans.push({
  id: "f19e77c4-7f0d-422d-9332-60d7b9e67f66",
  spanId: ormSpanId,
  traceId: createPostTraceId,
  parentSpanId: createPostSpanId,
  traceGroupId: createPostTraceGroupId,
  name: "ORM CALL",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750100000000",
  endTimeUnixNano: "1632825750600000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:01Z",
  updatedAt: "2023-10-01T12:00:01.5Z",
  attributes: JSON.stringify({
    "ORM.method": "createOne",
    "ORM.model": "post",
  }),
});

createPost.spans.push({
  id: "b3356b0e-6b77-460a-bc3b-6ec8ab1f7835",
  spanId: sqlSpanId,
  traceId: createPostTraceId,
  parentSpanId: ormSpanId,
  traceGroupId: createPostTraceGroupId,
  name: "SQL Query",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750100000000",
  endTimeUnixNano: "1632825750600000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:01Z",
  updatedAt: "2023-10-01T12:00:01.5Z",
  attributes: JSON.stringify({
    "db.query":
      "INSERT INTO post (id, title, content) VALUES ('1', 'First post', 'This is the first post')",
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
  createPost.spans.push({
    id: additionalSpanIds[index],
    spanId: additionalSpanIds[index] + "-span-id",
    traceId: createPostTraceId,
    parentSpanId: createPostSpanId, // Link to the root span
    traceGroupId: createPostTraceGroupId,
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
