import { GraphQLDebuggerContext } from "@graphql-debugger/trace-schema";

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
      GraphQLDebuggerContext: new GraphQLDebuggerContext({
        includeResult: true,
        includeContext: true,
        includeVariables: true,
      }),
    },
  });

  return response;
}
