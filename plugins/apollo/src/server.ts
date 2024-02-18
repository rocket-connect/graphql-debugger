import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import util from "util";

import { graphqlDebuggerPlugin } from ".";

const sleep = util.promisify(setTimeout);

const posts = [
  {
    title: "Hello world",
    author: {
      name: "John Doe",
    },
  },
];

const typeDefs = /* GraphQL */ `
  type Query {
    posts: [Post]!
  }

  type Post {
    title: String!
    author: User!
  }

  type User {
    name: String!
  }
`;

const resolvers = {
  Query: {
    posts: async () => {
      await sleep(1000);

      return posts;
    },
  },
  User: {
    name: async (root: any) => {
      await sleep(1000);

      return root.name;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [graphqlDebuggerPlugin({})],
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

main();
