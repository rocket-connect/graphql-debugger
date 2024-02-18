import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import {
  GraphQLDebuggerContext,
  SchemaExporer,
} from "@graphql-debugger/trace-schema";

import { ApolloServerPlugin } from "@apollo/server";
import { GraphQLRequestExecutionListener } from "@apollo/server";

type Context = {
  contextValue?: {
    GraphQLDebuggerContext?: GraphQLDebuggerContext;
  };
};

export const graphqlDebuggerPlugin = ({
  adapter = new ProxyAdapter(),
  shouldExportSchema = true,
}: {
  adapter?: BaseAdapter;
  shouldExportSchema?: boolean;
} = {}): ApolloServerPlugin<Context> => {
  return {
    serverWillStart: async (service) => {
      const schema = service.schema;
      if (shouldExportSchema) {
        const schemaExporter = new SchemaExporer({
          adapter,
          schema,
        });
        schemaExporter.start();
      }
    },
    requestDidStart: async () => {
      return {
        async didResolveOperation(requestContext): Promise<void> {
          console.log(requestContext.operation?.name?.value);
        },
        async didEncounterErrors(requestContext) {
          console.log(requestContext.errors);
        },
        async executionDidStart(
          ctx,
        ): Promise<void | GraphQLRequestExecutionListener<Context>> {
          console.log("executionDidStart", ctx.operationName);

          return {
            willResolveField(fieldCtx) {
              console.log(fieldCtx.info.fieldName);

              return (error) => {
                if (error) {
                  console.log(error);
                }
              };
            },
          };
        },
        async willSendResponse(requestContext) {
          console.log(requestContext.response);
        },
      };
    },
  };
};
