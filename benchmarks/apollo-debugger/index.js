import { graphqlDebuggerPlugin } from "@graphql-debugger/apollo-server";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import cluster from "cluster";
import { cpus } from "os";

process.env.PORT = "8000";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  const schema = makeExecutableSchema({
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
  });

  const server = new ApolloServer({
    schema,
    plugins: [graphqlDebuggerPlugin()],
  });

  server.listen(8000);
}
