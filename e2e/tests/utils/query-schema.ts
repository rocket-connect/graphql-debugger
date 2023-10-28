import { GraphQLOTELContext } from "@graphql-debugger/trace-schema";

import { GraphQLSchema, graphql } from "graphql";

export async function querySchema({
  schema,
  query,
}: {
  schema: GraphQLSchema;
  query: string;
}) {
  const response = await graphql({
    schema: schema,
    source: query,
    contextValue: {
      GraphQLOTELContext: new GraphQLOTELContext({
        includeResult: true,
        includeContext: true,
        includeVariables: true,
      }),
    },
  });

  return response;
}
