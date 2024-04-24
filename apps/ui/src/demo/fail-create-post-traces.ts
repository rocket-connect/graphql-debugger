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
const createPostSpanId = "378903-ee8a-3ca4-3ou3-3783";
const createPostTraceId = "37893-8f25-3879-a16c-76f3c9cc9dbb";
const createPostTraceGroupId = "thuio3-472d-42d8-3uji3io-3c2b1fda2c83";

export const failCreatePost: Trace = {
  id: createPostTraceGroupId,
  traceId: createPostTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

// Root span
failCreatePost.spans.push({
  id: "d22b6b2f-644f-4a62-37893-37837844",
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
  }),
  graphqlVariables: JSON.stringify({
    title: "First post",
    content: "This is the first post",
  }),
  errorMessage: "Token Missing",
  errorStack: "Error: Token Missing\n    at login (index.js:1:1)",
});
