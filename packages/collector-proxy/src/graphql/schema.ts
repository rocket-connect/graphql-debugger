import { GraphQLOTELContext, traceSchema } from '@graphql-debugger/trace-schema';
import SchemaBuilder from '@pothos/core';
import { Objects } from './objects';
import { GraphQLSchema } from 'graphql';
import { Context } from './context';

export const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: Context;
}>({});

builder.queryType({});

require('./queries');

export const schema: GraphQLSchema = traceSchema({ schema: builder.toSchema() });
