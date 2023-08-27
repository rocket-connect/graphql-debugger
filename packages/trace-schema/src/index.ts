import { setupOtel } from './setup-otel';
setupOtel();

import { makeExecutableSchema } from '@graphql-tools/schema';
import { getResolversFromSchema } from '@graphql-tools/utils';
import {
  GraphQLSchema,
  Kind,
  printSchema,
  visit,
  parse,
  FieldDefinitionNode,
  print,
} from 'graphql';
import { traceDirective } from 'graphql-otel';
import { debug } from './debug';

export interface TraceSchemaInput {
  schema: GraphQLSchema;
}

export function traceSchema({ schema }: TraceSchemaInput): GraphQLSchema {
  debug('Tracing schema');

  const directive = traceDirective();

  const ast = visit(parse(printSchema(schema)), {
    FieldDefinition: {
      enter(node: FieldDefinitionNode) {
        const existingTraceDirective = node.directives?.find(
          (directive) => directive.name.value === 'trace'
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
              value: 'trace',
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
    })
  );

  debug('Traced schema');

  return tracedSchema;
}
