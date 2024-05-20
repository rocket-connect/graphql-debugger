import { DebuggerClient } from "@graphql-debugger/client";
import { GraphQLDebuggerContext } from "@graphql-debugger/trace-schema";

import { GraphQLSchema } from "graphql";

import { rootSpanLoader, spanLoader } from "./loaders/span";

export type Context = {
  GraphQLDebuggerContext: GraphQLDebuggerContext;
  client: DebuggerClient;
  loaders: {
    rootSpanLoader: ReturnType<typeof rootSpanLoader>;
    spanLoader: ReturnType<typeof spanLoader>;
  };
};

export function context({
  client,
  schema,
  schemaHash,
}: {
  client: DebuggerClient;
  schema: GraphQLSchema;
  schemaHash: string;
}): () => Context {
  return (): Context => {
    return {
      GraphQLDebuggerContext: new GraphQLDebuggerContext({
        schema,
        schemaHash,
      }),
      client,
      loaders: {
        rootSpanLoader: rootSpanLoader({
          client,
        }),
        spanLoader: spanLoader({
          client,
        }),
      },
    };
  };
}
