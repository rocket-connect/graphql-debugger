import { safeJson } from "@graphql-debugger/utils";
import { defaultFieldResolver, GraphQLSchema, print } from "graphql";
import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";
import {
  AttributeNames,
  Context,
  context as otelContext,
  Span,
} from "@graphql-debugger/opentelemetry";
import { GraphQLOTELContext } from "./context";
import { runInSpan } from "./run-in-span";

export function traceDirective(directiveName = "trace") {
  return {
    typeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
    transformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const traceDirective = getDirective(
            schema,
            fieldConfig,
            directiveName,
          )?.[0];

          if (!traceDirective) {
            return;
          }

          const { resolve = defaultFieldResolver } = fieldConfig;

          return {
            ...fieldConfig,
            resolve: async function (source, args, context, info) {
              const internalCtx =
                context.GraphQLOTELContext as GraphQLOTELContext;

              if (!internalCtx) {
                throw new Error("contextValue.GraphQLOTELContext missing");
              }

              if (!internalCtx.schema) {
                internalCtx.setSchema(schema);
              }

              const parentContext = internalCtx
                ? internalCtx.getContext()
                : undefined;

              const traceCTX: Context = parentContext || otelContext.active();
              internalCtx.setContext(traceCTX);

              const parentSpan = context.parentSpan as Span | undefined;

              const isRoot = ["Query", "Mutation", "Subscription"].includes(
                info.parentType.name,
              );

              let name = "";
              if (isRoot) {
                name = `${info.parentType.name.toLowerCase()} ${
                  info.operation.name?.value || info.fieldName
                }`;
              } else {
                name = `${info.parentType.name} ${fieldConfig.astNode?.name.value}`;
              }

              const attributeContext = {
                ...context,
                GraphQLOTELContext: undefined,
              };

              if (internalCtx?.excludeKeysFromContext?.length) {
                Object.keys(attributeContext).forEach((key) => {
                  if (internalCtx?.excludeKeysFromContext?.includes(key)) {
                    delete attributeContext[key];
                  }
                });
              }

              const operationArgs = safeJson(args || {});

              const result = await runInSpan(
                {
                  name,
                  context: traceCTX,
                  tracer: internalCtx.tracer,
                  parentSpan,
                  attributes: {
                    [AttributeNames.OPERATION_NAME]: info.fieldName,
                    [AttributeNames.OPERATION_TYPE]:
                      info.operation.operation.toLowerCase(),
                    ...(isRoot
                      ? {
                          [AttributeNames.DOCUMENT]: print(info.operation),
                        }
                      : {}),
                    [AttributeNames.SCHEMA_HASH]: internalCtx.schemaHash,
                    [AttributeNames.OPERATION_RETURN_TYPE]:
                      info.returnType.toString(),
                    ...(internalCtx.includeVariables && isRoot
                      ? { [AttributeNames.OPERATION_ARGS]: operationArgs }
                      : {}),
                    ...(internalCtx.includeContext && isRoot
                      ? {
                          [AttributeNames.OPERATION_CONTEXT]:
                            safeJson(attributeContext),
                        }
                      : {}),
                  },
                },
                async (span) => {
                  if (!internalCtx.getRootSpan()) {
                    internalCtx.setRootSpan(span);
                  }

                  context.currentSpan = span;

                  const result = await resolve(source, args, context, info);

                  if (internalCtx.includeResult && isRoot) {
                    if (
                      typeof result === "number" ||
                      typeof result === "string" ||
                      typeof result === "boolean"
                    ) {
                      span.setAttribute(
                        AttributeNames.OPERATION_RESULT,
                        result,
                      );
                    } else if (typeof result === "object") {
                      span.setAttribute(
                        AttributeNames.OPERATION_RESULT,
                        safeJson(result || {}),
                      );
                    }
                  }

                  context.parentSpan = span;

                  return result;
                },
              );

              return result;
            },
          };
        },
      });
    },
  };
}
