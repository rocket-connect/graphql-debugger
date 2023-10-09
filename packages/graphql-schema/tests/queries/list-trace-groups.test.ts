import { createTestTraceGroup } from "@graphql-debugger/data-access";
import { ListTraceGroupsResponseSchema } from "@graphql-debugger/schemas";
import {
  GraphQLOTELContext,
  traceSchema,
} from "@graphql-debugger/trace-schema";
import { ListTraceGroupsResponse } from "@graphql-debugger/types";

import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "gql-tag";
import { graphql } from "graphql";
import util from "util";

import { request } from "../utils";

const sleep = util.promisify(setTimeout);

describe("queries/list-trace-groups", () => {
  test("should return a list of trace groups", async () => {
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
        createdAt
        updatedAt
        isForeign
      }
    `;

    // Make a traced schema that points to the collector
    const tracedSchema = traceSchema({
      schema: makeExecutableSchema({
        typeDefs: gql`
          type User {
            id: ID!
            name: String!
          }

          type Query {
            users: [User]
          }
        `,
        resolvers: {
          Query: {
            users: () => {
              return [
                {
                  id: 1,
                  name: "John",
                },
              ];
            },
          },
        },
      }),
    });

    // Run the query twice to ensure we get two trace groups
    await Promise.all(
      [1, 2].map(async () => {
        const _response = await graphql({
          schema: tracedSchema,
          source: gql`
            {
              users {
                id
                name
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

        expect(_response.errors).toBeUndefined();
      }),
    );

    await sleep(2000); // wait for collector to injest the traces

    const response = await request()
      .post("/graphql")
      .send({ query })
      .set("Accept", "application/json");

    const body = await response.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(2);

    const parsed = ListTraceGroupsResponseSchema.parse(listTraceGroups);

    expect(parsed).toEqual(listTraceGroups);
  });

  test("should return a list of trace groups filtered by id", async () => {
    const createdTraceGroup = await createTestTraceGroup();
    await createTestTraceGroup(); // create another so we exclude it

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
      .send({ query, variables: { where: { id: createdTraceGroup.id } } })
      .set("Accept", "application/json");

    const body = await response.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(1);

    expect(listTraceGroups.traces[0].id).toBe(createdTraceGroup.id);
  });

  test("should return a list of trace groups filtered by schemaId", async () => {
    const createdTraceGroup = await createTestTraceGroup();
    await createTestTraceGroup(); // create another so we exclude it

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
        variables: { where: { schemaId: createdTraceGroup.schemaId } },
      })
      .set("Accept", "application/json");

    const body = await response.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(1);

    expect(listTraceGroups.traces[0].id).toBe(createdTraceGroup.id);
  });
});
