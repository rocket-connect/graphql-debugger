import { SetupOtelInput, setupOtel } from "@graphql-debugger/opentelemetry";
import { traceDirective } from "@graphql-debugger/trace-directive";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { getResolversFromSchema } from "@graphql-tools/utils";
import {
  FieldDefinitionNode,
  GraphQLSchema,
  Kind,
  parse,
  print,
  printSchema,
  visit,
} from "graphql";

import { debug } from "./debug";
import { SchemaExporer } from "./schema-exporter";

export interface TraceSchemaInput {
  schema: GraphQLSchema;
  exporterConfig?: SetupOtelInput["exporterConfig"];
  instrumentations?: SetupOtelInput["instrumentations"];
}

export function traceSchema({
  schema,
  exporterConfig,
  instrumentations,
}: TraceSchemaInput): GraphQLSchema {
  debug("Tracing schema");

  setupOtel({ exporterConfig, instrumentations });

  const directive = traceDirective();

  const ast = visit(parse(printSchema(schema)), {
    FieldDefinition: {
      enter(node: FieldDefinitionNode) {
        const existingTraceDirective = node.directives?.find(
          (directive) => directive.name.value === "trace",
        );

        if (existingTraceDirective) {
          return;
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

  const schemaExporer = new SchemaExporer(tracedSchema, exporterConfig);
  schemaExporer.start();

  debug("Traced schema");

  return tracedSchema;
}

export * from "@graphql-debugger/trace-directive";
