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

require("./queries");

const build = builder.toSchema();

export const schema = TRACE_SCHEMA
  ? traceSchema({
      schema: build,
      ...(TRACE_PRISMA && {
        instrumentations: [tracing],
      }),
    })
  : build;

export const hash = hashSchema(schema);
