import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";
import util from "util";

import {
  GraphQLOTELContext,
  traceSchema,
} from "../../../trace-schema/build/index";

const sleep = util.promisify(setTimeout);

// simulates two traces being run with the name 'query posts'
export async function simulateTrace() {
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

  return {
    schema: tracedSchema,
  };
}
