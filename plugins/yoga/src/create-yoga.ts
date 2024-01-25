import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import {
  GraphQLDebuggerContext,
  GraphQLDebuggerContextOptions,
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
  debugger?: Omit<TraceSchemaInput, "schema" | "adapter"> & {
    shouldDisable?: boolean;
    otelContextOptions?: GraphQLDebuggerContextOptions;
    traceSchemaOptions?: Omit<TraceSchemaInput, "schema" | "adapter">;
    adapter?: BaseAdapter;
  };
  schema: GraphQLSchema;
  context?: (req: any) => Promise<TUserContext>;
}

export function createYoga<
  TServerContext extends Record<string, any> = {},
  TUserContext extends Record<string, any> & {
    GraphQLDebuggerContext?: GraphQLDebuggerContext;
  } = {},
>(
  options: DebuggerYogaOptions<TServerContext, TUserContext>,
): YogaServerInstance<TServerContext, TUserContext> {
  if (!options.schema) {
    throw new Error("Schema is required when using GraphQL Debugger");
  }

  if (!options.context) {
    const contextOverride = async (): Promise<TUserContext> => {
      return {
        GraphQLDebuggerContext: new GraphQLDebuggerContext(
          options?.debugger?.otelContextOptions,
        ),
      } as unknown as TUserContext;
    };

    options.context = contextOverride;
  }

  if (typeof options.context === "function") {
    const originalContextFunction = options.context;
    options.context = async function newContextFunction(...args) {
      const contextObject = await originalContextFunction(...args);

      contextObject.GraphQLDebuggerContext = new GraphQLDebuggerContext(
        options?.debugger?.otelContextOptions,
      );

      return contextObject;
    };
  }

  let adapter = options?.debugger?.adapter;
  if (!adapter) {
    adapter = new ProxyAdapter();
  }

  const schema = options.debugger?.shouldDisable
    ? options.schema
    : traceSchema({
        schema: options.schema,
        adapter: adapter as BaseAdapter,
        ...options.debugger?.traceSchemaOptions,
      });

  const yoga = originalCreateYoga<TServerContext, TUserContext>({
    ...options,
    schema,
  });

  return yoga;
}
