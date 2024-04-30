import { makeExecutableSchema } from "@graphql-tools/schema";
import { printSchemaWithDirectives } from "@graphql-tools/utils";

import { SQLiteAdapter } from "../../adapters/sqlite/build";
import { traceSchema } from "../src";

describe("tracedSchema", () => {
  test("should add trace directive to all fields in schema", () => {
    const typeDefs = `
        type User {
            name: String!
        }

        type Query {
            user: User!
        }
      `;

    const resolvers = {
      Query: {
        user: () => ({ name: "John" }),
      },
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    const adapter = new SQLiteAdapter();

    const tracedSchema = traceSchema({
      schema,
      adapter,
      shouldExportSchema: false,
    });

    const outputTypedefs = printSchemaWithDirectives(tracedSchema.schema);

    expect(outputTypedefs).toMatchInlineSnapshot(`
"schema {
  query: Query
}

directive @trace on FIELD_DEFINITION

type User {
  name: String! @trace
}

type Query {
  user: User! @trace
}"
`);
  });

  test("should add trace directive to all queries and mutations but not fields", () => {
    const typeDefs = `
        type User {
            name: String!
            email: String!
        }

        type Post {
            title: String!
            content: String!
        }

        type Query {
            user: User!
            posts: [Post]!
        }

        type Mutation {
          createUser(name: String!): User!
        }
      `;

    const resolvers = {
      Query: {
        user: () => ({ name: "John" }),
      },
      Mutation: {
        createUser: (_, { name }) => ({ name }),
      },
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    const adapter = new SQLiteAdapter();

    const tracedSchema = traceSchema({
      schema,
      adapter,
      shouldExportSchema: false,
      shouldExcludeTypeFields: true,
    });

    const outputTypedefs = printSchemaWithDirectives(tracedSchema.schema);

    expect(outputTypedefs).toMatchInlineSnapshot(`
"schema {
  query: Query
  mutation: Mutation
}

directive @trace on FIELD_DEFINITION

type User {
  name: String!
  email: String!
}

type Post {
  title: String!
  content: String!
}

type Query {
  user: User! @trace
  posts: [Post]! @trace
}

type Mutation {
  createUser(name: String!): User! @trace
}"
`);
  });
});
