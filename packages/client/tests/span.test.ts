import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";
import util from "util";

// to avoid circular dependency
import {
  GraphQLOTELContext,
  traceSchema,
} from "../../trace-schema/build/index";
import { DebuggerClient } from "../src/client";
import { prisma } from "./utils/prisma";

const sleep = util.promisify(setTimeout);

describe("DebuggerClient.span", () => {
  describe("aggregate", () => {
    test("should aggregate spans", async () => {
      const client = new DebuggerClient();

      // Make a traced schema that points to the collector
      const tracedSchema = traceSchema({
        schema: makeExecutableSchema({
          typeDefs: /* GraphQL */ `
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
            source: /* GraphQL */ `
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

          expect(_response.errors).toBeUndefined();
        }),
      );

      await sleep(2000); // wait for collector to injest the traces

      // The first schema as we clearDB before each test
      const schema = await prisma.schema.findFirst({
        include: { traceGroups: true },
      });
      expect(schema).toBeDefined();

      const response = await client.span.aggregate({
        where: {
          name: "query posts",
          schemaId: schema?.id as string,
        },
      });

      expect(response.resolveCount).toEqual(2);
      expect(response.errorCount).toEqual(0);
      expect(response.averageDuration).toBeDefined();
      expect(response.lastResolved).toBeDefined();
    });
  });
});
