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
      }
    `;

    const typeDefs = gql`
      type User {
        id: ID!
        name: String!
      }

      type Query {
        users: [User]
      }
    `;

    const resolvers = {
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
    };

    const executableSchema = makeExecutableSchema({
      typeDefs: typeDefs,
      resolvers,
    });

    const tracedSchema = traceSchema({
      schema: executableSchema,
    });

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
});
