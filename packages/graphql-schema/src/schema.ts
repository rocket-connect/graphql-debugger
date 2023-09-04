import { traceSchema } from "@graphql-debugger/trace-schema";
import SchemaBuilder from "@pothos/core";
import { Objects } from "./objects";
import { Context } from "./context";
import { TRACE_SCHEMA } from "./config";
import { graphql } from "@graphql-debugger/utils";

export const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: Context;
}>({});

builder.queryType({});
builder.mutationType({});

require("./queries");
require("./mutations");

const build = builder.toSchema();

export const schema: graphql.GraphQLSchema = TRACE_SCHEMA
  ? traceSchema({ schema: build })
  : build;
