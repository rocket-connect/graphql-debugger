import { DebuggerClient } from "@graphql-debugger/client";
import {
  GraphQLDebuggerContext,
  traceSchema,
} from "@graphql-debugger/trace-schema";
import { Schema } from "@graphql-debugger/types";
import { hashSchema } from "@graphql-debugger/utils";

import { faker } from "@faker-js/faker";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { GraphQLSchema, graphql } from "graphql";
import supertest from "supertest";

import { createServer } from "../src";
import { client } from "./client";

const app = express();

app.post("/graphql", createServer({ client: client }));

export function request() {
  return supertest(app);
}

export async function createTestTraceGroup({
  client,
}: {
  client: DebuggerClient;
}) {
  const testSchema = await createTestSchema({
    client,
  });
  const traceId = faker.string.alpha(8);

  const createdTraceGroup = await client.trace.createOne({
    input: {
      traceId,
      schemaId: testSchema.dbSchema.id,
    },
  });

  return createdTraceGroup;
}

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

  const schema = traceSchema({
    schema: executableSchema,
  });

  const hash = hashSchema(schema);

  const dbSchema = await client.schema.upsert({
    where: {
      hash,
    },
    input: {
      hash: hash,
      typeDefs: typeDefs,
    },
  });

  return {
    schema,
    typeDefs,
    hash,
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

export async function querySchema({
  schema,
  query,
}: {
  schema: GraphQLSchema;
  query: string;
}) {
  const response = await graphql({
    schema: schema,
    source: query,
    contextValue: {
      GraphQLDebuggerContext: new GraphQLDebuggerContext({
        includeResult: true,
        includeContext: true,
        includeVariables: true,
      }),
    },
  });

  return response;
}
