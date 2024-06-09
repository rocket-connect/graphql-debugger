import { DebuggerClient } from "@graphql-debugger/client";
import { TraceSchemaInput } from "@graphql-debugger/trace-schema";

import { createYoga } from "graphql-yoga";

import { context } from "./context";
import { createSchema } from "./schema";

export function createServer({
  client,
  spanProcessorFactory,
}: {
  client: DebuggerClient;
  spanProcessorFactory?: TraceSchemaInput["spanProcessorFactory"];
}) {
  const { schema, schemaHash } = createSchema({ client, spanProcessorFactory });

  return createYoga({
    schema,
    context: context({ client, schema, schemaHash }),
  });
}
