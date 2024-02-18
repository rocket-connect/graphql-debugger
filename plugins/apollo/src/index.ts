import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import {
  Context as OTELContext,
  Span,
  infoToAttributes,
  infoToSpanName,
  context as otelContext,
  runInSpan,
  setupOtel,
} from "@graphql-debugger/opentelemetry";
import {
  GraphQLDebuggerContext,
  SchemaExporer,
} from "@graphql-debugger/trace-schema";
import { AttributeNames } from "@graphql-debugger/types";
import { isGraphQLInfoRoot, safeJson } from "@graphql-debugger/utils";

import { ApolloServerPlugin } from "@apollo/server";

type GraphQLContext = {
  GraphQLDebuggerContext?: GraphQLDebuggerContext;
  parentSpan?: Span | undefined;
  currentSpan?: Span | undefined;
};

export const graphqlDebuggerPlugin = ({
  adapter = new ProxyAdapter(),
  shouldExportSchema = true,
}: {
  adapter?: BaseAdapter;
  shouldExportSchema?: boolean;
} = {}): ApolloServerPlugin<GraphQLContext> => {
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

      setupOtel({});
    },
    requestDidStart: async (requestContext) => {
      const internalCtx = new GraphQLDebuggerContext();
      internalCtx.setSchema(requestContext.schema);

      return {
        async executionDidStart(requestContext) {
          return {
            willResolveField(fieldCtx) {
              const parentContext = internalCtx
                ? internalCtx.getContext()
                : undefined;

              const traceCTX: OTELContext =
                parentContext || otelContext.active();
              internalCtx.setContext(traceCTX);

              const parentSpan = fieldCtx.contextValue.parentSpan as
                | Span
                | undefined;

              const attributes = infoToAttributes({
                info: fieldCtx.info,
                args: fieldCtx.args,
                context: fieldCtx.contextValue,
                schemaHash: internalCtx.schemaHash,
              });

              const { spanName } = infoToSpanName({
                info: fieldCtx.info,
              });

              let span: Span | undefined;

              runInSpan(
                {
                  name: spanName,
                  context: traceCTX,
                  tracer: internalCtx.tracer,
                  parentSpan,
                  attributes,
                },
                (_s) => {
                  span = _s;
                  requestContext.contextValue.currentSpan = _s;
                },
              );

              const callback = (error: Error | null, result: any) => {
                if (error) {
                  console.log(error);
                }

                if (span) {
                  if (!internalCtx.getRootSpan()) {
                    internalCtx.setRootSpan(span);
                  }

                  if (isGraphQLInfoRoot({ info: fieldCtx.info })) {
                    if (internalCtx.includeResult && result) {
                      span.setAttribute(
                        AttributeNames.OPERATION_RESULT,
                        safeJson({ result }),
                      );
                    }
                  }

                  requestContext.contextValue.parentSpan = span;
                }
              };

              return callback;
            },
          };
        },
      };
    },
  };
};
