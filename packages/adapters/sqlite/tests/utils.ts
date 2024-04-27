import { Span } from "@graphql-debugger/data-access";

import { faker } from "@faker-js/faker";

import { prisma } from "../src/prisma";

export async function createFakeSchema({
  hash,
  schema,
}: {
  hash: string;
  schema: string;
}) {
  const s = await prisma.schema.create({
    data: {
      hash: hash,
      typeDefs: schema,
    },
  });

  return s;
}

export async function createFakeSpan({
  traceGroupId,
  traceId,
  isRoot,
  rootSpanName,
  shouldError,
}: {
  traceGroupId: string;
  traceId: string;
  isRoot?: boolean;
  rootSpanName?: string;
  shouldError?: boolean;
}): Promise<Span> {
  const spanId = faker.datatype.uuid();
  const parentSpanId = faker.datatype.uuid();
  const name = rootSpanName || faker.random.word();
  const kind = faker.random.word();
  const startTimeUnixNano = faker.datatype.number();
  const endTimeUnixNano = faker.datatype.number();
  const errorMessage = shouldError ? faker.random.words() : undefined;
  const errorStack = shouldError ? faker.random.words() : undefined;
  const graphqlDocument = faker.random.words();
  const graphqlSchemaHash = faker.random.words();
  const graphqlOperationName = faker.random.words();
  const graphqlOperationType = faker.random.words();
  const isForeign = faker.datatype.boolean();

  const span = await prisma.span.create({
    data: {
      spanId: spanId,
      parentSpanId: parentSpanId,
      name: name,
      kind: kind,
      startTimeUnixNano: startTimeUnixNano,
      endTimeUnixNano: endTimeUnixNano,
      traceId,
      traceGroupId,
      errorMessage: errorMessage,
      errorStack: errorStack,
      graphqlDocument: graphqlDocument,
      graphqlSchemaHash: graphqlSchemaHash,
      graphqlOperationName: graphqlOperationName,
      durationNano: endTimeUnixNano - startTimeUnixNano,
      graphqlOperationType: graphqlOperationType,
      isForeign: isForeign,
      isGraphQLRootSpan: isRoot || false,
    },
  });

  return span;
}
