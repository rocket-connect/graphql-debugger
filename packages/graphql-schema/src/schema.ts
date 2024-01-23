import { DebuggerClient } from "@graphql-debugger/client";
import { tracing } from "@graphql-debugger/data-access";
import { traceSchema } from "@graphql-debugger/trace-schema";
import { hashSchema } from "@graphql-debugger/utils";

import SchemaBuilder from "@pothos/core";

import { TRACE_PRISMA, TRACE_SCHEMA } from "./config";
import { Context } from "./context";
import { Objects } from "./objects";

export const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: Context;
}>({});

builder.queryType({});
builder.mutationType({});

require("./queries");
require("./mutations");

const build = builder.toSchema();

export function createSchema({ client }: { client: DebuggerClient }) {
  const schema = TRACE_SCHEMA
    ? traceSchema({
        client,
        schema: build,
        ...(TRACE_PRISMA && {
          instrumentations: [tracing],
        }),
      })
    : build;

  const hash = hashSchema(schema);

  return { schema, hash };
}
