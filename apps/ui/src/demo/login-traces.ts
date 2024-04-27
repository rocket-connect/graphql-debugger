import { AttributeNames, Trace } from "@graphql-debugger/types";

import { demoSchema } from "./schema";

const loginMutation = /* GraphQL */ `
  mutation {
    login(username: "test", password: "test")
  }
`;

// Hardcoded UUIDs for consistency
const loginSpanId = "a1b2c3d4-e5f6-7g8h-9i0j-k11l12m13n14";
const successfullLoginTraceId = "o1p2q3r4-s5t6-u7v8-w9x0-yz12x34w56v7";
const successfullLoginTraceGroupId = "m1n2o3p4-q5r6-s7t8-u9v0-wxyz1234v567";

export const successfullLogin: Trace = {
  id: successfullLoginTraceGroupId,
  traceId: successfullLoginTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

// Successfull login spans
successfullLogin.spans.push({
  id: "abcd1234-efgh-5678-ijkl-9012mn34op56",
  spanId: loginSpanId,
  traceId: successfullLoginTraceId,
  traceGroupId: successfullLoginTraceGroupId,
  name: "mutation login",
  kind: "0",
  durationNano: "1000000",
  startTimeUnixNano: "1632825750000000000",
  endTimeUnixNano: "1632825751000000000",
  isForeign: false,
  createdAt: "2023-10-01T12:00:00Z",
  updatedAt: "2023-10-01T12:00:01Z",
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

// ORM CALL and SQL Query for successful login
successfullLogin.spans.push({
  id: "efgh5678-ijkl-9012-mn34-op56qrst7890",
  spanId: "a2b2c2d2-e2f2-7g2h-9i2j-k12l22m23n24",
  traceId: successfullLoginTraceId,
  parentSpanId: loginSpanId,
  traceGroupId: successfullLoginTraceGroupId,
  name: "ORM CALL",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750100000000",
  endTimeUnixNano: "1632825750600000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:01Z",
  updatedAt: "2023-10-01T12:00:01.5Z",
  attributes: JSON.stringify({
    "ORM.method": "findOne",
    "ORM.model": "User",
  }),
});

successfullLogin.spans.push({
  id: "ijkl9012-mn34-op56-qrst-7890abcd1234",
  spanId: "b2c2d2e2-f2g2-2h2i-2j2k-2l2m2n2o2p2",
  traceId: successfullLoginTraceId,
  parentSpanId: "a2b2c2d2-e2f2-7g2h-9i2j-k12l22m23n24",
  traceGroupId: successfullLoginTraceGroupId,
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
      "SELECT user_id FROM users WHERE username = 'test' AND password = 'hashed_password'",
  }),
});

// Token Service for successful login
successfullLogin.spans.push({
  id: "mnop56qr-st78-uvwx-yz01-2345abcd6789",
  spanId: "c2d2e2f2-g2h2-i2j2-k2l2-m2n2o2p2q2r2",
  traceId: successfullLoginTraceId,
  parentSpanId: loginSpanId,
  traceGroupId: successfullLoginTraceGroupId,
  name: "Token Service",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825750610000000",
  endTimeUnixNano: "1632825751110000000",
  isForeign: true,
  createdAt: "2023-10-01T12:00:01Z",
  updatedAt: "2023-10-01T12:00:01.5Z",
  attributes: JSON.stringify({
    username: "test",
  }),
});

// Failed login
const failedLoginTraceId = "z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4";
const failedLoginSqlTraceGroupId = "k4l5m6n7-p8o9-q0r1-s2t3-u4v5w6x7y8z9";
const failedLoginSpanId = "d7e6f5g4-h3i2-j1k0-l9m8-n7o6p5q4r3s2";

export const failedLogin: Trace = {
  id: "5678mnop-9qrs-tuvw-xyz0-1234abcd5678",
  traceId: failedLoginTraceId,
  spans: [],
  schemaId: "demo",
  get rootSpan() {
    return this.spans.find((span) => span.isGraphQLRootSpan);
  },
};

// Failed login spans
failedLogin.spans.push({
  id: "tuvwxyz0-1234-abcd-5678-mnop9qrs6789",
  spanId: failedLoginSpanId,
  traceId: failedLoginTraceId,
  traceGroupId: failedLoginSqlTraceGroupId,
  name: "mutation login",
  kind: "0",
  durationNano: "1000000",
  startTimeUnixNano: "1632825850000000000",
  endTimeUnixNano: "1632825851000000000",
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

// ORM CALL and SQL Query for failed login
failedLogin.spans.push({
  id: "abcd6789-0123-4567-89ab-cdef01234567",
  spanId: "e7f6g5h4-i3j2-k1l0-m9n8-o7p6q5r4s3t2",
  traceId: failedLoginTraceId,
  parentSpanId: failedLoginSpanId,
  traceGroupId: failedLoginSqlTraceGroupId,
  name: "ORM CALL",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825850100000000",
  endTimeUnixNano: "1632825850600000000",
  isForeign: true,
  createdAt: "2023-10-01T12:01:01Z",
  updatedAt: "2023-10-01T12:01:01.5Z",
  attributes: JSON.stringify({
    "ORM.method": "findOne",
    "ORM.model": "User",
  }),
});

failedLogin.spans.push({
  id: "01234567-89ab-cdef-0123-456789abcdef",
  spanId: "f7g6h5i4-j3k2-l1m0-n9o8-p7q6r5s4t3u2",
  traceId: failedLoginTraceId,
  parentSpanId: "e7f6g5h4-i3j2-k1l0-m9n8-o7p6q5r4s3t2",
  traceGroupId: failedLoginSqlTraceGroupId,
  name: "SQL Query",
  kind: "0",
  durationNano: "500000",
  startTimeUnixNano: "1632825850100000000",
  endTimeUnixNano: "1632825850600000000",
  isForeign: true,
  createdAt: "2023-10-01T12:01:01Z",
  updatedAt: "2023-10-01T12:01:01.5Z",
  attributes: JSON.stringify({
    "db.query":
      "SELECT user_id FROM users WHERE username = 'test' AND password = 'hashed_password'",
  }),
});
