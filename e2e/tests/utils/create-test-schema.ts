import { DebuggerClient } from "@graphql-debugger/client";
import { BatchSpanProcessor } from "@graphql-debugger/opentelemetry";
import { traceSchema } from "@graphql-debugger/trace-schema";
import { Schema } from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";

export async function createTestSchema({
  client,
  shouldError,
  randomFieldName,
  shouldNameQuery,
}: {
  client: DebuggerClient;
  shouldError?: boolean;
  randomFieldName?: string;
  shouldNameQuery?: boolean;
  name?: string;
}): Promise<{
  schema: GraphQLSchema;
  typeDefs: string;
  hash: string;
  dbSchema: Schema;
  query: string;
  randomFieldName: string;
}> {
  const random = randomFieldName || faker.string.alpha(6);

  const typeDefs = /* GraphQL */ `
    type User {
      id: ID!
      name: String!
      ${random}: String!
    }

    type Query {
      users(name: String): [User]
    }
  `;

  const resolvers = {
    Query: {
      users: () => {
        if (shouldError) {
          throw new Error("test");
        }

        return [
          {
            id: 1,
            name: "John",
            [random]: "test",
          },
        ];
      },
    },
  };

  const executableSchema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers,
  });

  const { schema, schemaHash } = traceSchema({
    schema: executableSchema,
    adapter: client.adapter,
    spanProcessorFactory: (exporter) =>
      new BatchSpanProcessor(exporter, {
        scheduledDelayMillis: 100,
      }),
  });

  const dbSchema = await client.schema.upsert({
    where: {
      hash: schemaHash,
    },
    input: {
      hash: schemaHash,
      typeDefs: typeDefs,
    },
  });

  return {
    schema,
    typeDefs,
    hash: schemaHash,
    dbSchema,
    query: /* GraphQL */ `
      query ${shouldNameQuery ? random : ""} {
        users(name: "John") {
          id
          name
          ${random}
        }
      }
    `,
    randomFieldName: random,
  };
}
