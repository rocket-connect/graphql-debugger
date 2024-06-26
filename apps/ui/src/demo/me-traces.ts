import { AttributeNames, Trace } from "@graphql-debugger/types";

import { v4 as uuid } from "uuid";

import { demoSchema } from "./schema";

const meQuery = /* GraphQL */ `
  query {
    me {
      id
      username
      posts {
        id
        title
        content
      }
    }
  }
`;

const meQuerySpanId = uuid();
const meQueryTraceId = uuid();
const meQueryTraceGroupId = uuid();

export const meQueryTrace: Trace = {
  id: meQueryTraceGroupId,
  traceId: meQueryTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

meQueryTrace.spans.push({
  id: uuid(),
  spanId: meQuerySpanId,
  traceId: meQueryTraceId,
  traceGroupId: meQueryTraceGroupId,
  name: "query me",
  kind: "0",
  durationNano: "1000000",
  startTimeUnixNano: "1632825750000000000",
  endTimeUnixNano: "1632825751000000000",
  isForeign: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isGraphQLRootSpan: true,
  graphqlOperationName: "me",
  graphqlOperationType: "Query",
  graphqlSchemaHash: demoSchema.hash,
  attributes: JSON.stringify({
    [AttributeNames.OPERATION_NAME]: "me",
    [AttributeNames.OPERATION_TYPE]: "Query",
    [AttributeNames.OPERATION_RETURN_TYPE]: "String!",
    [AttributeNames.OPERATION_ROOT]: true,
    [AttributeNames.DOCUMENT]: meQuery,
  }),
  graphqlDocument: meQuery,
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  parentSpanId: meQuerySpanId,
  traceGroupId: meQueryTraceGroupId,
  name: "ORM CALL",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({
    "ORM.method": "findOne",
    "ORM.model": "User",
  }),
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  parentSpanId: meQueryTrace.spans[1].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "SQL Query",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({
    "db.query": "SELECT user_id FROM users WHERE id = 'user_id'",
  }),
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  parentSpanId: meQueryTrace.spans[0].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "User me",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: meQueryTrace.spans[3].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "User id",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: meQueryTrace.spans[3].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "User username",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: meQueryTrace.spans[3].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "User posts",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  parentSpanId: meQueryTrace.spans[6].spanId,
  traceGroupId: meQueryTraceGroupId,
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
    "ORM.model": "Post",
  }),
});
meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  parentSpanId: meQueryTrace.spans[7].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "SQL Query",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({
    "db.query":
      "SELECT id, title, content FROM posts WHERE user_id = 'user_id'",
  }),
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: meQueryTrace.spans[6].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "Post id",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: meQueryTrace.spans[6].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "Post title",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
});

meQueryTrace.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: meQueryTraceId,
  // this is the parent span id of the span Post posts
  parentSpanId: meQueryTrace.spans[6].spanId,
  traceGroupId: meQueryTraceGroupId,
  name: "Post content",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
});

const failedLoginTraceId = uuid();
const failedLoginSqlTraceGroupId = uuid();
const failedmeQuerySpanId = uuid();

export const failedLogin: Trace = {
  id: uuid(),
  traceId: failedLoginTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

failedLogin.spans.push({
  id: uuid(),
  spanId: failedmeQuerySpanId,
  traceId: failedLoginTraceId,
  traceGroupId: failedLoginSqlTraceGroupId,
  name: "mutation login",
  kind: "0",
  durationNano: "1000000",
  startTimeUnixNano: "1632825750000000000",
  endTimeUnixNano: "1632825751000000000",
  isForeign: false,
  createdAt: "2023-10-01T12:01:00Z",
  updatedAt: "2023-10-01T12:01:01Z",
  isGraphQLRootSpan: true,
  graphqlOperationName: "login",
  graphqlOperationType: "Mutation",
  graphqlSchemaHash: demoSchema.hash,
  attributes: JSON.stringify({
    [AttributeNames.OPERATION_NAME]: "login",
    [AttributeNames.OPERATION_TYPE]: "Mutation",
    [AttributeNames.OPERATION_RETURN_TYPE]: "String!",
    [AttributeNames.OPERATION_ROOT]: true,
    [AttributeNames.DOCUMENT]: meQuery,
  }),
  graphqlDocument: meQuery,
  errorMessage: "Invalid credentials",
  errorStack: "Error: Invalid credentials\n    at login (index.js:1:1)",
});

failedLogin.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: failedLoginTraceId,
  parentSpanId: failedmeQuerySpanId,
  traceGroupId: failedLoginSqlTraceGroupId,
  name: "ORM CALL",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:02Z",
  updatedAt: "2023-10-01T12:00:02.5Z",
  attributes: JSON.stringify({
    "ORM.method": "findOne",
    "ORM.model": "User",
  }),
});

failedLogin.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: failedLoginTraceId,
  traceGroupId: failedLoginSqlTraceGroupId,
  parentSpanId: failedLogin.spans[1].spanId,
  graphqlSchemaHash: demoSchema.hash,
  name: "SQL Query",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750200000000",
  endTimeUnixNano: "1632825750700000000",
  isForeign: true,
  createdAt: "2023-10-01T12:01:02Z",
  updatedAt: "2023-10-01T12:01:02.5Z",
  attributes: JSON.stringify({
    "db.query":
      "SELECT user_id FROM users WHERE username = 'test' AND password = 'hashed_password'",
  }),
});
