import { AggregateSpansResponseSchema } from "@graphql-debugger/schemas";
import {
  GraphQLDebuggerContext,
  traceSchema,
} from "@graphql-debugger/trace-schema";
import { AggregateSpansResponse } from "@graphql-debugger/types";

import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "gql-tag";
import { graphql } from "graphql";
import util from "util";

import { client } from "../client";
import { request } from "../utils";

const sleep = util.promisify(setTimeout);

const query = gql`
  query ($where: AggregateSpansWhere!) {
    aggregateSpans(where: $where) {
      resolveCount
      errorCount
      averageDuration
      lastResolved
    }
  }
`;

describe("queries/aggregate-spans", () => {
  test("should aggregate and return spans", async () => {
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
              return [
                {
                  content: "graphql-debugger is awesome!",
                },
              ];
            },
          },
        },
      }),
    });

    await sleep(2000); // wait for collector to injest the schema

    // Run the query twice to ensure we get two trace groups
    await Promise.all(
      [1, 2].map(async () => {
        const _response = await graphql({
          schema: tracedSchema,
          source: gql`
            {
              posts {
                content
              }
            }
          `,
          contextValue: {
            GraphQLDebuggerContext: new GraphQLDebuggerContext({
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

    const schema = await client.schema.findFirst({
      options: { includeTraces: true },
    });

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: { where: { schemaId: schema?.id, name: "query posts" } },
      })
      .set("Accept", "application/json");

    const body = await response.body;

    const aggregateSpans = body.data?.aggregateSpans as AggregateSpansResponse;

    aggregateSpans.spans = [];

    const parsed = AggregateSpansResponseSchema.parse(aggregateSpans);

    expect(parsed).toEqual(aggregateSpans);

    expect(aggregateSpans.resolveCount).toBe(2);
    expect(aggregateSpans.errorCount).toBe(0);
  });
});
