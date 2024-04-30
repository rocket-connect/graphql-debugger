import { createSchema, createYoga } from "@graphql-debugger/graphql-yoga";

import cluster from "cluster";
import { createServer } from "node:http";
import { cpus } from "os";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  const yoga = createYoga({
    schema: createSchema({
      typeDefs: `
        type Query {
          hello: String!
        }
      `,
      resolvers: {
        Query: {
          hello: () => "world",
        },
      },
    }),
    logging: false,
  });

  const server = createServer(yoga);

  server.listen(8000);
}
