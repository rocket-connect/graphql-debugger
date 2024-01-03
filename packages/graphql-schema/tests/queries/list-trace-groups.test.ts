import { prisma } from "@graphql-debugger/data-access";
import { ListTraceGroupsResponseSchema } from "@graphql-debugger/schemas";
import { ListTraceGroupsResponse } from "@graphql-debugger/types";

import gql from "gql-tag";
import util from "util";

import { createTestSchema, querySchema } from "../utils";
import { request } from "../utils";

const sleep = util.promisify(setTimeout);

const query = gql`
  query {
    listTraceGroups {
      traces {
        id
        traceId
        firstSpanErrorMessage
        firstSpanErrorStack
        firstSpanErrorMessage
        firstSpanErrorStack
        spans {
          ...SpanObject
        }
        rootSpan {
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
    graphqlOperationName
    graphqlOperationType
    createdAt
    updatedAt
    isForeign
  }
`;

describe("queries/list-trace-groups", () => {
  test("should return a list of trace groups", async () => {
    const testSchema = await createTestSchema();

    const testSchemaResponse = await querySchema({
      schema: testSchema.schema,
      query: testSchema.query,
    });
    expect(testSchemaResponse.errors).toBeUndefined();
    await sleep(500);

    const apiResponse = await request()
      .post("/graphql")
      .send({ query })
      .set("Accept", "application/json");

    const body = await apiResponse.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(1);

    const parsed = ListTraceGroupsResponseSchema.parse(listTraceGroups);

    expect(parsed).toEqual(listTraceGroups);
  });

  test("should return a list of trace groups filtered by id", async () => {
    const testSchema = await createTestSchema();

    const testSchemaResponse = await querySchema({
      schema: testSchema.schema,
      query: testSchema.query,
    });
    expect(testSchemaResponse.errors).toBeUndefined();
    await sleep(500);

    const traces = await prisma.traceGroup.findMany({
      where: {
        schemaId: testSchema.dbSchema.id,
      },
      include: {
        spans: true,
      },
    });

    const query = gql`
      query ($where: ListTraceGroupsWhere) {
        listTraceGroups(where: $where) {
          traces {
            id
          }
        }
      }
    `;

    const response = await request()
      .post("/graphql")
      .send({ query, variables: { where: { id: traces[0].id } } })
      .set("Accept", "application/json");

    const body = await response.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(1);

    expect(listTraceGroups.traces[0].id).toBe(traces[0].id);
  });

  test("should return a list of trace groups filtered by schemaId", async () => {
    const testSchema = await createTestSchema();

    const testSchemaResponse = await querySchema({
      schema: testSchema.schema,
      query: testSchema.query,
    });
    expect(testSchemaResponse.errors).toBeUndefined();
    await sleep(500);

    const traces = await prisma.traceGroup.findMany({
      where: {
        schemaId: testSchema.dbSchema.id,
      },
      include: {
        spans: true,
      },
    });

    const query = gql`
      query ($where: ListTraceGroupsWhere) {
        listTraceGroups(where: $where) {
          traces {
            id
          }
        }
      }
    `;

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: { where: { schemaId: traces[0].schemaId } },
      })
      .set("Accept", "application/json");

    const body = await response.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(1);

    expect(listTraceGroups.traces[0].id).toBe(traces[0].id);
  });

  test.todo("should return a list of trace groups filtered by root span name");

  test("should return a list of trace groups filtered by error", async () => {
    // Make a traced schema that points to the collector
    const tracedSchema = traceSchema({
      schema: makeExecutableSchema({
        typeDefs: gql`
          type Post {
            content: String!
          }

          type Query {
            posts: [Post]
          }
        `,
        resolvers: {
          Query: {
            posts: () => {
              throw new Error("Something went wrong"); // This test is asserting that this error is caught
            },
          },
        },
      }),
    });

    await sleep(2000); // wait for collector to injest the schema

    // Run the query twice to ensure we get two trace groups
    await Promise.all(
      [1, 2].map(async () => {
        await graphql({
          schema: tracedSchema,
          source: gql`
            {
              posts {
                content
              }
            }
          `,
          contextValue: {
            GraphQLOTELContext: new GraphQLOTELContext({
              includeResult: true,
              includeContext: true,
              includeVariables: true,
            }),
          },
        });
      }),
    );

    await sleep(2000); // wait for collector to injest the traces

    const query = gql`
      query ($where: ListTraceGroupsWhere) {
        listTraceGroups(where: $where) {
          traces {
            id
          }
        }
      }
    `;

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: { where: { isError: true } },
      })
      .set("Accept", "application/json");

    const body = await response.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(2);
  });
});
