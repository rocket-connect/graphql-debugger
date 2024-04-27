import { Span } from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";

import { localAdapter } from "./adapters";

export async function createFakeSchema({
  hash,
  schema,
}: {
  hash: string;
  schema: string;
}) {
  await localAdapter.schema.createOne({
    data: {
      hash: hash,
      schema: schema,
    },
  });

  const s = await localAdapter.schema.findFirst({
    where: {
      hash,
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
  const spanId = faker.string.uuid();
  const parentSpanId = faker.string.uuid();
  const name = rootSpanName || faker.lorem.word();
  const kind = faker.number.int();
  const startTimeUnixNano = faker.number.int().toString();
  const endTimeUnixNano = faker.number.int().toString();
  const errorMessage = shouldError ? faker.lorem.words() : undefined;
  const errorStack = shouldError ? faker.lorem.words() : undefined;
  const graphqlDocument = faker.lorem.words();
  const graphqlSchemaHash = faker.lorem.words();
  const graphqlOperationName = faker.lorem.words();
  const graphqlOperationType = faker.lorem.words();
  const isForeign = faker.datatype.boolean();

  const { span } = await localAdapter.span.createOne({
    input: {
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
      graphqlOperationType: graphqlOperationType,
      isForeign: isForeign,
      isGraphQLRootSpan: isRoot || false,
    },
  });

  return span;
}
