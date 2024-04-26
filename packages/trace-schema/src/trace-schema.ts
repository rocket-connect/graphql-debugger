/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { SetupOtelInput, setupOtel } from "@graphql-debugger/opentelemetry";
import { traceDirective } from "@graphql-debugger/trace-directive";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { getResolversFromSchema } from "@graphql-tools/utils";
import { GraphQLSchema, Kind, parse, print, printSchema, visit } from "graphql";

import { debug } from "./debug";
import { SchemaExporer } from "./schema-exporter";

export interface TraceSchemaInput {
  schema: GraphQLSchema;
  adapter: BaseAdapter;
  exporterConfig?: SetupOtelInput["exporterConfig"];
  instrumentations?: SetupOtelInput["instrumentations"];
  shouldExportSchema?: boolean;
  // If you have large schema, enable this so you still get traces, but not one for each field on each type.
  shouldExcludeTypeFields?: boolean;
}

export function traceSchema({
  schema,
  exporterConfig,
  adapter,
  instrumentations,
  shouldExportSchema = true,
  shouldExcludeTypeFields = false,
}: TraceSchemaInput): GraphQLSchema {
  debug("Tracing schema");

  setupOtel({ exporterConfig, instrumentations });

  const directive = traceDirective();

  const ast = visit(parse(printSchema(schema)), {
    ObjectTypeDefinition: {
      enter(node) {
        // @ts-ignore
        this.currentType = node.name.value;
      },
    },
    FieldDefinition: {
      enter(node) {
        const existingTraceDirective = node.directives?.find(
          (directive) => directive.name.value === "trace",
        );

        if (existingTraceDirective) {
          return undefined;
        }

        if (
          shouldExcludeTypeFields &&
          // @ts-ignore
          !["Query", "Mutation", "Subscription"].includes(this.currentType)
        ) {
          return undefined;
        }

        const newDirectives = [
          ...(node.directives ?? []),
          {
            kind: Kind.DIRECTIVE,
            name: {
              kind: Kind.NAME,
              value: "trace",
            },
          },
        ];

        return {
          ...node,
          directives: newDirectives,
        };
      },
    },
  });

  const resolvers = getResolversFromSchema(schema);

  const tracedSchema = directive.transformer(
    makeExecutableSchema({
      typeDefs: [print(ast), directive.typeDefs],
      resolvers,
    }),
  );

  if (shouldExportSchema) {
    const schemaExporer = new SchemaExporer({
      schema: tracedSchema,
      adapter,
    });
    schemaExporer.start();
  }

  debug("Traced schema");

  return tracedSchema;
}
