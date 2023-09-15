import { hashSchema } from "@graphql-debugger/utils";

import { faker } from "@faker-js/faker";
import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "gql-tag";
import { printSchema } from "graphql";

import { prisma } from "./index";

export async function createTestSchema() {
  const fakeTypeName = faker.string.alpha(8);
  const fakeSchemaName = faker.string.alpha(8);

  const typeDefs = gql`
    type ${fakeTypeName} {
        id: ID!
    }

    type Query {
        users: [${fakeTypeName}]
    }
  `;

  const resolvers = {
    Query: {
      users: () => [],
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const hash = hashSchema(schema);

  const createdSchema = await prisma.schema.create({
    data: {
      hash,
      typeDefs: printSchema(schema),
      name: fakeSchemaName,
    },
  });

  return createdSchema;
}

export async function createTestTraceGroup() {
  const testSchema = await createTestSchema();
  const traceId = faker.string.alpha(8);

  const createdTraceGroup = await prisma.traceGroup.create({
    data: {
      traceId,
      schemaId: testSchema.id,
    },
  });

  return createdTraceGroup;
}
