import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import {
  SetupOtelInput,
  Span,
  SpanStatusCode,
  createLegacySpan,
  infoToAttributes,
  infoToSpanName,
  context as otelContext,
  setupOtel,
} from "@graphql-debugger/opentelemetry";
import {
  GraphQLDebuggerContext,
  SchemaExporer,
} from "@graphql-debugger/trace-schema";
import { AttributeNames } from "@graphql-debugger/types";
import { isGraphQLInfoRoot, safeJson } from "@graphql-debugger/utils";

import { ApolloServerPlugin } from "@apollo/server";
import { Path } from "graphql/jsutils/Path";

type GraphQLContext = {
  GraphQLDebuggerContext?: GraphQLDebuggerContext;
  parentSpan?: Span | undefined;
  currentSpan?: Span | undefined;
};

function generatePathString(path: Path | undefined): string {
  let currentPath: Path | undefined = path;

  const pathSegments: Array<string> = [];
  while (currentPath && currentPath.prev) {
    if (isNaN(Number(currentPath.key))) {
      pathSegments.unshift(currentPath.key.toString());
    }
    currentPath = currentPath.prev;
  }
  return pathSegments.join(".");
}

export const graphqlDebuggerPlugin = ({
  adapter = new ProxyAdapter(),
  shouldExportSchema = true,
  exporterConfig,
  instrumentations,
}: {
  adapter?: BaseAdapter;
  shouldExportSchema?: boolean;
  exporterConfig?: SetupOtelInput["exporterConfig"];
  instrumentations?: SetupOtelInput["instrumentations"];
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

      setupOtel({ exporterConfig, instrumentations });
    },
    requestDidStart: async () => {
      const spanMap = new Map<string, Span>();

      return {
        async executionDidStart(requestContext) {
          const internalCtx = new GraphQLDebuggerContext();
          internalCtx.setSchema(requestContext.schema);

          return {
            willResolveField(fieldCtx) {
              const parentPathString = generatePathString(
                fieldCtx.info.path.prev,
              );

              const parentPath =
                parentPathString === "" ? "root" : parentPathString;

              const parentSpan = parentPath
                ? spanMap.get(parentPath)
                : undefined;

              const traceCTX = otelContext.active();

              const attributes = infoToAttributes({
                info: fieldCtx.info,
                args: fieldCtx.args,
                context: fieldCtx.contextValue,
                schemaHash: internalCtx.schemaHash,
              });

              const { spanName } = infoToSpanName({
                info: fieldCtx.info,
              });

              const span = createLegacySpan({
                options: {
                  name: spanName,
                  context: traceCTX,
                  tracer: internalCtx.tracer,
                  attributes,
                },
                ...(parentSpan
                  ? {
                      parentContext: parentSpan?.spanContext(),
                    }
                  : {}),
              });

              const currentPathString = generatePathString(fieldCtx.info.path);

              const currentPath =
                currentPathString === "" ? "root" : currentPathString;

              spanMap.set(currentPath, span);

              const callback = (error: Error | null, result: any) => {
                if (!span) {
                  return;
                }

                if (error) {
                  const e = error as Error;
                  span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: e.message,
                  });
                  span.recordException(e);
                } else {
                  if (isGraphQLInfoRoot({ info: fieldCtx.info })) {
                    if (internalCtx.includeResult && result) {
                      span.setAttribute(
                        AttributeNames.OPERATION_RESULT,
                        safeJson({ result }),
                      );
                    }
                  }
                }

                span.end();
              };

              return callback;
            },
          };
        },
      };
    },
  };
};
