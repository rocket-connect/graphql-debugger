import { traceSchema } from '@graphql-debugger/trace-schema';
import SchemaBuilder from '@pothos/core';
import { Objects } from './objects';
import { GraphQLSchema } from 'graphql';

export const builder = new SchemaBuilder<{
  Objects: Objects;
}>({});

builder.queryType({});

require('./queries');

export const schema: GraphQLSchema = traceSchema({ schema: builder.toSchema() });
