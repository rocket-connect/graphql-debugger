import { graphqlDebuggerPlugin } from "@graphql-debugger/apollo-server";

import { ApolloServer } from "apollo-server";
import cluster from "cluster";
import { cpus } from "os";

process.env.PORT = "8000";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  const server = new ApolloServer({
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
    plugins: [graphqlDebuggerPlugin()],
  });

  server.listen(8000);
}
