import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { GraphQLOTELContext } from '@graphql-debugger/trace-schema';

export const yoga = createYoga({
  schema,
  context: () => ({
    GraphQLOTELContext: new GraphQLOTELContext(),
  }),
});
