import { TraceSchemaInput } from "@graphql-debugger/trace-schema";

import {
  YogaServerInstance,
  YogaServerOptions,
  createYoga as originalCreateYoga,
} from "graphql-yoga";

interface DebuggerYogaOptions<TServerContext, TUserContext>
  extends YogaServerOptions<TServerContext, TUserContext> {
  debugger: Omit<TraceSchemaInput, "schema">;
}

export function createYoga<
  TServerContext extends Record<string, any> = {},
  TUserContext extends Record<string, any> = {},
>(
  options: DebuggerYogaOptions<TServerContext, TUserContext>,
): YogaServerInstance<TServerContext, TUserContext> {
  const yoga = originalCreateYoga<TServerContext, TUserContext>(options);

  return yoga;
}
