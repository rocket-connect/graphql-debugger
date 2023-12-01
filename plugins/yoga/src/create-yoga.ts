import {
  GraphQLOTELContext,
  GraphQLOTELContextOptions,
  TraceSchemaInput,
  traceSchema,
} from "@graphql-debugger/trace-schema";

import { GraphQLSchema } from "graphql";
import {
  YogaServerInstance,
  YogaServerOptions,
  createYoga as originalCreateYoga,
} from "graphql-yoga";

interface DebuggerYogaOptions<TServerContext, TUserContext>
  extends YogaServerOptions<TServerContext, TUserContext> {
  debugger?: Omit<TraceSchemaInput, "schema"> & {
    shouldDisable?: boolean;
    GraphQLOTELContextOptions?: GraphQLOTELContextOptions;
    TraceSchemaOptions?: Omit<TraceSchemaInput, "schema">;
  };
  schema: GraphQLSchema;
  context?: (req: any) => Promise<TUserContext>;
}

export function createYoga<
  TServerContext extends Record<string, any> = {},
  TUserContext extends Record<string, any> & {
    GraphQLOTELContext?: GraphQLOTELContext;
  } = {},
>(
  options: DebuggerYogaOptions<TServerContext, TUserContext>,
): YogaServerInstance<TServerContext, TUserContext> {
  if (!options.schema) {
    throw new Error("Schema is required");
  }

  if (!options.context) {
    const contextOverride = async (): Promise<TUserContext> => {
      return {
        GraphQLOTELContext: new GraphQLOTELContext(
          options?.debugger?.GraphQLOTELContextOptions,
        ),
      } as unknown as TUserContext;
    };

    options.context = contextOverride;
  }

  if (typeof options.context === "function") {
    const originalContextFunction = options.context;
    options.context = async (...args) => {
      const contextObject = await originalContextFunction(...args);

      contextObject.GraphQLOTELContext = new GraphQLOTELContext(
        options?.debugger?.GraphQLOTELContextOptions,
      );

      return contextObject;
    };
  }

  const schema = options.debugger?.shouldDisable
    ? options.schema
    : traceSchema({
        schema: options.schema,
        ...options.debugger?.TraceSchemaOptions,
      });

  const yoga = originalCreateYoga<TServerContext, TUserContext>({
    ...options,
    schema,
  });

  return yoga;
}
