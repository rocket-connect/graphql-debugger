import { DebuggerClient } from "@graphql-debugger/client";
import { GraphQLOTELContext } from "@graphql-debugger/trace-schema";

import { rootSpanLoader, spanLoader } from "./loaders/span";

export type Context = {
  GraphQLOTELContext: GraphQLOTELContext;
  client: DebuggerClient;
  loaders: {
    rootSpanLoader: ReturnType<typeof rootSpanLoader>;
    spanLoader: ReturnType<typeof spanLoader>;
  };
};

export function context({ client }: { client: DebuggerClient }): () => Context {
  return (): Context => {
    return {
      GraphQLOTELContext: new GraphQLOTELContext({
        includeVariables: true,
        // includeResult: true, 08/10/2023 - disabled to avoid memory related issues
        // includeContext: true, ditto
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
