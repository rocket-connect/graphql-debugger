import {
  Context,
  Span,
  infoToAttributes,
  infoToSpanName,
  context as otelContext,
  runInSpan,
} from "@graphql-debugger/opentelemetry";
import { AttributeNames } from "@graphql-debugger/types";
import { isGraphQLInfoRoot, safeJson } from "@graphql-debugger/utils";

import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils";
import { GraphQLSchema, defaultFieldResolver } from "graphql";

import { GraphQLOTELContext } from "./context";

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

              const _context = {
                ...context,
                GraphQLOTELContext: undefined,
              };

              if (internalCtx?.excludeKeysFromContext?.length) {
                Object.keys(_context).forEach((key) => {
                  if (internalCtx?.excludeKeysFromContext?.includes(key)) {
                    delete _context[key];
                  }
                });
              }

              const attributes = infoToAttributes({
                info,
                args,
                context: _context,
                schemaHash: internalCtx.schemaHash,
              });

              const { spanName } = infoToSpanName({
                info,
              });

              const result = await runInSpan(
                {
                  name: spanName,
                  context: traceCTX,
                  tracer: internalCtx.tracer,
                  parentSpan,
                  attributes,
                },
                async (span) => {
                  if (!internalCtx.getRootSpan()) {
                    internalCtx.setRootSpan(span);
                  }

                  context.currentSpan = span;

                  const result = await resolve(source, args, context, info);

                  if (isGraphQLInfoRoot({ info })) {
                    if (internalCtx.includeResult && result) {
                      span.setAttribute(
                        AttributeNames.OPERATION_RESULT,
                        safeJson({ result }),
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
