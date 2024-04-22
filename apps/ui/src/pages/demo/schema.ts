import { Schema } from "@graphql-debugger/types";
import { hashSchema } from "@graphql-debugger/utils";

import { makeExecutableSchema } from "@graphql-tools/schema";

export const typeDefs = /* GraphQL */ `
  type User {
    ID: ID!
    username: String!
    posts: [Post!]!
  }

  type Post {
    ID: ID!
    title: String!
    content: String!
  }

  type Query {
    me: User!
    posts: [Post]!
  }

  type Mutation {
    login(username: String!, password: String!): String!
    createPost(title: String!, content: String!): Post!
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  noLocation: true,
});

const schemaHash = hashSchema(schema);

export const demoSchema: Schema = {
  id: "demo",
  hash: schemaHash,
  name: "Demo Schema",
  typeDefs,
  traceGroups: [],
  createdAt: new Date().toISOString(),
};
