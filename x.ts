import { createYoga } from "@graphql-debugger/graphql-yoga";

import { makeExecutableSchema } from "@graphql-tools/schema";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  debugger: {
    shouldDisable: boolean,
  },
});
