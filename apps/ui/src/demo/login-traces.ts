import { AttributeNames, Trace } from "@graphql-debugger/types";

import { v4 as uuid } from "uuid";

import { demoSchema } from "./schema";

const loginMutation = /* GraphQL */ `
  mutation {
    login(username: "test", password: "test")
  }
`;

const loginSpanId = uuid();
const successfullLoginTraceId = uuid();
const successfullLoginTraceGroupId = uuid();

export const successfullLogin: Trace = {
  id: successfullLoginTraceGroupId,
  traceId: successfullLoginTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

successfullLogin.spans.push({
  id: uuid(),
  spanId: loginSpanId,
  traceId: successfullLoginTraceId,
  traceGroupId: successfullLoginTraceGroupId,
  name: "mutation login",
  kind: "0",
  durationNano: "1000000",
  startTimeUnixNano: "1632825750000000000",
  endTimeUnixNano: "1632825751000000000",
  isForeign: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isGraphQLRootSpan: true,
  graphqlOperationName: "login",
  graphqlOperationType: "Mutation",
  graphqlSchemaHash: demoSchema.hash,
  attributes: JSON.stringify({
    [AttributeNames.OPERATION_NAME]: "login",
    [AttributeNames.OPERATION_TYPE]: "Mutation",
    [AttributeNames.OPERATION_RETURN_TYPE]: "String!",
    [AttributeNames.OPERATION_ROOT]: true,
    [AttributeNames.DOCUMENT]: loginMutation,
  }),
  graphqlDocument: loginMutation,
});

successfullLogin.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: successfullLoginTraceId,
  parentSpanId: loginSpanId,
  traceGroupId: successfullLoginTraceGroupId,
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

successfullLogin.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: successfullLoginTraceId,
  parentSpanId: successfullLogin.spans[1].spanId,
  traceGroupId: successfullLoginTraceGroupId,
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
      "SELECT user_id FROM users WHERE username = 'test' AND password = 'hashed_password'",
  }),
});

const failedLoginTraceId = uuid();
const failedLoginSqlTraceGroupId = uuid();
const failedLoginSpanId = uuid();

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
  spanId: failedLoginSpanId,
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
    [AttributeNames.DOCUMENT]: loginMutation,
  }),
  graphqlDocument: loginMutation,
  errorMessage: "Invalid credentials",
  errorStack: "Error: Invalid credentials\n    at login (index.js:1:1)",
});

failedLogin.spans.push({
  id: uuid(),
  spanId: uuid(),
  traceId: failedLoginTraceId,
  parentSpanId: failedLoginSpanId,
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
