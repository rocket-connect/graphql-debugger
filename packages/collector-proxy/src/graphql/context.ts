import { GraphQLOTELContext } from '@graphql-debugger/trace-schema';
import { rootSpanLoader, spanLoader } from './loaders/span';

export type Context = {
  GraphQLOTELContext: GraphQLOTELContext;
  loaders: {
    rootSpanLoader: ReturnType<typeof rootSpanLoader>;
    spanLoader: ReturnType<typeof spanLoader>;
  };
};

export function context(...args: any[]): Context {
  return {
    GraphQLOTELContext: new GraphQLOTELContext({
      includeVariables: true,
      includeResult: true,
    }),
    loaders: {
      rootSpanLoader: rootSpanLoader(),
      spanLoader: spanLoader(),
    },
  };
}
