import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import {
  ApiSpan,
  SetupOtelInput,
  SpanStatusCode,
  infoToAttributes,
  infoToSpanName,
  context as otelContext,
  setupOtel,
  trace,
} from "@graphql-debugger/opentelemetry";
import {
  GraphQLDebuggerContext,
  SchemaExporer,
} from "@graphql-debugger/trace-schema";
import { hashSchema } from "@graphql-debugger/utils";

import { ApolloServerPlugin } from "@apollo/server";
import { Path } from "graphql/jsutils/Path";

type GraphQLContext = {
  GraphQLDebuggerContext?: GraphQLDebuggerContext;
  parentSpan?: ApiSpan | undefined;
  currentSpan?: ApiSpan | undefined;
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
  let schemaHash: string;

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

      schemaHash = hashSchema(schema);
      setupOtel({ exporterConfig, instrumentations });
    },
    requestDidStart: async ({ schema }) => {
      const spanMap = new Map<string, ApiSpan>();

      return {
        async executionDidStart(context) {
          const internalCtx =
            context.contextValue.GraphQLDebuggerContext ||
            new GraphQLDebuggerContext({
              schema,
              schemaHash,
            });

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

              const currentContext = otelContext.active();

              const ctx = parentSpan
                ? trace.setSpan(currentContext, parentSpan)
                : currentContext;

              const attributes = infoToAttributes({
                info: fieldCtx.info,
                args: fieldCtx.args,
                context: fieldCtx.contextValue,
                schemaHash: internalCtx.schemaHash,
              });

              const { spanName } = infoToSpanName({
                info: fieldCtx.info,
              });

              const span = internalCtx.tracer.startSpan(
                spanName,
                {
                  attributes,
                },
                ctx,
              );

              const currentPathString = generatePathString(fieldCtx.info.path);

              const currentPath =
                currentPathString === "" ? "root" : currentPathString;

              spanMap.set(currentPath, span);

              const callback = (error: Error | null) => {
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
