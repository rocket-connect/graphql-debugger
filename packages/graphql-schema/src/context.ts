import { GraphQLOTELContext } from "@graphql-debugger/trace-schema";

import { rootSpanLoader, spanLoader } from "./loaders/span";

export type Context = {
  GraphQLOTELContext: GraphQLOTELContext;
  loaders: {
    rootSpanLoader: ReturnType<typeof rootSpanLoader>;
    spanLoader: ReturnType<typeof spanLoader>;
  };
};

export function context(): Context {
  return {
    GraphQLOTELContext: new GraphQLOTELContext({
      includeVariables: true,
      // includeResult: true, 08/10/2023 - disabled to avoid memory related issues
      // includeContext: true, ditto
    }),
    loaders: {
      rootSpanLoader: rootSpanLoader(),
      spanLoader: spanLoader(),
    },
  };
}
