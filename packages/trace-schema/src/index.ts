import { setupOtel } from "./setup-otel";
import type { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { getResolversFromSchema } from "@graphql-tools/utils";
import { graphql } from "@graphql-debugger/utils";
import { traceDirective } from "graphql-otel";
import { debug } from "./debug";
import { SchemaExporer } from "./schema-exporter";

export interface TraceSchemaInput {
  schema: graphql.GraphQLSchema;
  exporterConfig?: OTLPExporterNodeConfigBase;
}

export function traceSchema({
  schema,
  exporterConfig,
}: TraceSchemaInput): graphql.GraphQLSchema {
  debug("Tracing schema");

  setupOtel({ exporterConfig });

  const directive = traceDirective();

  const ast = graphql.visit(graphql.parse(graphql.printSchema(schema)), {
    FieldDefinition: {
      enter(node: graphql.FieldDefinitionNode) {
        const existingTraceDirective = node.directives?.find(
          (directive) => directive.name.value === "trace",
        );

        if (existingTraceDirective) {
          return;
        }

        const newDirectives = [
          ...(node.directives ?? []),
          {
            kind: graphql.Kind.DIRECTIVE,
            name: {
              kind: graphql.Kind.NAME,
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
      typeDefs: [graphql.print(ast), directive.typeDefs],
      resolvers,
    }),
  );

  const schemaExporer = new SchemaExporer(tracedSchema, exporterConfig);
  schemaExporer.start();

  debug("Traced schema");

  return tracedSchema;
}

export * from "graphql-otel";
