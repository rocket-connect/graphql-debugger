import { prisma } from "@graphql-debugger/data-access";
import { DeleteTracesResponseSchema } from "@graphql-debugger/schemas";
import {
  GraphQLOTELContext,
  traceSchema,
} from "@graphql-debugger/trace-schema";
import type { DeleteTracesResponse } from "@graphql-debugger/types";

import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "gql-tag";
import { graphql } from "graphql";
import util from "util";

import { request } from "../utils";

const sleep = util.promisify(setTimeout);

const query = gql`
  mutation ($where: DeleteTracesWhere!) {
    deleteTraces(where: $where) {
      success
    }
  }
`;

describe("mutations/delete-traces", () => {
  test("should delete traces", async () => {
    // Make a traced schema that points to the collector
    const tracedSchema = traceSchema({
      schema: makeExecutableSchema({
        typeDefs: gql`
          type Post {
            content: String!
          }

          type Comment {
            content: String
          }

          type Query {
            posts: [Post]
            comments: [Comment]
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
            comments: () => {
              return [
                {
                  content: "graphql-debugger is very awesome!",
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
        const postsquery = gql`
          query {
            posts {
              content
            }
          }
        `;

        const commentsquery = gql`
          query {
            comments {
              content
            }
          }
        `;

        await Promise.all(
          // Making two seperate queries to only delete one
          [postsquery, commentsquery].map(async (query) => {
            const _response = await graphql({
              schema: tracedSchema,
              source: query,
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
      }),
    );

    await sleep(2000); // wait for collector to injest the traces

    // The first schema as we clearDB before each test
    const schema = await prisma.schema.findFirst({
      include: { traceGroups: true },
    });

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: {
          where: {
            schemaId: schema?.id,
            // only deleting the posts query trace groups
            rootSpanName: "query posts",
          },
        },
      })
      .set("Accept", "application/json");

    const body = await response.body;

    const deleteTraces = body.data?.deleteTraces as DeleteTracesResponse;

    const parsed = DeleteTracesResponseSchema.parse(deleteTraces);

    expect(parsed).toEqual(deleteTraces);

    expect(deleteTraces.success).toEqual(true);

    const traceGroups = await prisma.traceGroup.findMany({
      where: {
        schemaId: schema?.id,
      },
      include: {
        spans: true,
      },
    });

    expect(traceGroups.length).toEqual(2);

    traceGroups.forEach((tg) => {
      expect(tg.spans.length).toEqual(2);

      tg.spans.forEach((span) => {
        // expecting only the comments to be left
        if (!span.parentSpanId) {
          expect(span.name).toEqual("query comments");
        } else {
          expect(span.name).toEqual("Comment content");
        }
      });
    });
  });
});
