import { Schema, prisma } from "@graphql-debugger/data-access";
import { traceSchema } from "@graphql-debugger/trace-schema";
import { hashSchema } from "@graphql-debugger/utils";

import { faker } from "@faker-js/faker";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";

export async function createTestSchema(): Promise<{
  schema: GraphQLSchema;
  typeDefs: string;
  hash: string;
  dbSchema: Schema;
  query: string;
}> {
  const randomFieldName = faker.string.alpha(6);

  const typeDefs = /* GraphQL */ `
    type User {
      id: ID!
      name: String!
      ${randomFieldName}: String!
    }

    type Query {
      users(name: String): [User]
    }
  `;

  const resolvers = {
    Query: {
      users: () => {
        return [
          {
            id: 1,
            name: "John",
            [randomFieldName]: "test",
          },
        ];
      },
    },
  };

  const executableSchema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers,
  });

  const schema = traceSchema({
    schema: executableSchema,
  });

  const hash = hashSchema(schema);

  const dbSchema = await prisma.schema.upsert({
    where: {
      hash,
    },
    create: {
      hash: hash,
      typeDefs: typeDefs,
    },
    update: {},
  });

  return {
    schema,
    typeDefs,
    hash,
    dbSchema,
    query: /* GraphQL */ `
      {
        users(name: "John") {
          id
          name
          ${randomFieldName}
        }
      }
    `,
  };
}
