import { DebuggerClient } from "@graphql-debugger/client";

import { createYoga } from "graphql-yoga";

import { context } from "./context";
import { schema } from "./schema";

export function createServer({ client }: { client: DebuggerClient }) {
  return createYoga({
    schema,
    context: context({ client }),
  });
}
