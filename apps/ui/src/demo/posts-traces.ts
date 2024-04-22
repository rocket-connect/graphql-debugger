import { AttributeNames, Trace } from "@graphql-debugger/types";

import { v4 as uuid } from "uuid";

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

const postsSpanId = uuid();
const postsTraceId = uuid();
const postsTraceGroupId = uuid();

export const postQuery: Trace = {
  id: postsTraceGroupId,
  traceId: postsTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

postQuery.spans.push({
  id: uuid(),
  spanId: postsSpanId,
  traceId: postsTraceId,
  traceGroupId: postsTraceGroupId,
  name: "query posts",
  kind: "0",
  durationNano: "1000000",
  startTimeUnixNano: "1632825750000000000",
  endTimeUnixNano: "1632825751000000000",
  isForeign: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isGraphQLRootSpan: true,
  graphqlOperationName: "posts",
  graphqlOperationType: "Query",
  graphqlSchemaHash: demoSchema.hash,
  attributes: JSON.stringify({
    [AttributeNames.OPERATION_NAME]: "posts",
    [AttributeNames.OPERATION_TYPE]: "Query",
    [AttributeNames.OPERATION_RETURN_TYPE]: "[Post]!",
    [AttributeNames.OPERATION_ROOT]: true,
    [AttributeNames.DOCUMENT]: postQuery,
  }),
  graphqlDocument: postsdQueryStr,
});

postQuery.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: postsTraceId,
  parentSpanId: postsSpanId,
  traceGroupId: postsTraceGroupId,
  name: "ORM CALL",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({
    "ORM.method": "findMany",
    "ORM.model": "post",
  }),
});

postQuery.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: postsTraceId,
  parentSpanId: postQuery.spans[1].spanId,
  traceGroupId: postsTraceGroupId,
  name: "SQL Query",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({
    "db.query": "SELECT id, title, content FROM posts",
  }),
});

postQuery.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: postsTraceId,
  parentSpanId: postsSpanId,
  traceGroupId: postsTraceGroupId,
  name: "Post posts",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({}),
});

postQuery.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: postsTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: postQuery.spans[3].spanId,
  traceGroupId: postsTraceGroupId,
  name: "Post id",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({}),
});

postQuery.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: postsTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: postQuery.spans[3].spanId,
  traceGroupId: postsTraceGroupId,
  name: "Post title",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({}),
});

postQuery.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: postsTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: postQuery.spans[3].spanId,
  traceGroupId: postsTraceGroupId,
  name: "Post content",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({}),
});
