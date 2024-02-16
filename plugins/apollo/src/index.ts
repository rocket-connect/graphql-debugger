import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import {
  GraphQLDebuggerContext,
  traceSchema,
} from "@graphql-debugger/trace-schema";

import { ApolloServerPlugin } from "@apollo/server";

export const graphqlDebuggerPlugin = ({
  adapter = new ProxyAdapter(),
}: {
  adapter?: BaseAdapter;
} = {}): ApolloServerPlugin<{
  contextValue?: {
    GraphQLDebuggerContext?: GraphQLDebuggerContext;
  };
}> => {
  return {
    serverWillStart: async (context) => {
      return {
        async schemaDidLoadOrUpdate() {
          context.schema = traceSchema({ schema: context.schema, adapter });
        },
      };
    },

    requestDidStart: async () => {
      return {
        async didResolveOperation(requestContext) {
          const key = "GraphQLDebuggerContext";

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const originalContext = requestContext.contextValue?.[key] as
            | GraphQLDebuggerContext
            | undefined;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          requestContext.contextValue[key] =
            originalContext || new GraphQLDebuggerContext();
        },
      };
    },
  };
};
