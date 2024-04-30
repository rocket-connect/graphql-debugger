import { DebuggerClient } from "@graphql-debugger/client";
import { tracing } from "@graphql-debugger/data-access";
import { traceSchema } from "@graphql-debugger/trace-schema";
import { hashSchema } from "@graphql-debugger/utils";

import SchemaBuilder from "@pothos/core";
import { GraphQLSchema } from "graphql";

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
  let schema: GraphQLSchema;
  let schemaHash: string;

  if (TRACE_SCHEMA) {
    const tracedSchema = traceSchema({
      schema: build,
      adapter: client.adapter,
      shouldExportSchema: false,
      ...(TRACE_PRISMA && {
        instrumentations: [tracing],
      }),
    });
    schema = tracedSchema.schema;
    schemaHash = tracedSchema.schemaHash;
  } else {
    schema = build;
    schemaHash = hashSchema(build);
  }

  return { schema, schemaHash };
}
