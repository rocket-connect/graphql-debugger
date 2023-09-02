import { traceSchema } from '@graphql-debugger/trace-schema';
import SchemaBuilder from '@pothos/core';
import { Objects } from './objects';
import { GraphQLSchema } from 'graphql';
import { Context } from './context';
import { TRACE_SCHEMA } from '../config';

export const builder = new SchemaBuilder<{
  Objects: Objects;
  Context: Context;
}>({});

builder.queryType({});
builder.mutationType({});

require('./queries');
require('./mutations');

const build = builder.toSchema();

export const schema: GraphQLSchema = TRACE_SCHEMA ? traceSchema({ schema: build }) : build;
