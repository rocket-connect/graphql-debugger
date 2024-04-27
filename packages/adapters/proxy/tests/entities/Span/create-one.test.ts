import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSchema } from "../../utils";

describe("Span", () => {
  describe("createOne", () => {
    test("should create one span", async () => {
      const traceId = faker.string.uuid();

      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
          schemaId: schema?.id,
        },
      });

      const graphqlDocument = faker.lorem.words();
      const graphqlOperationName = faker.lorem.words();
      const graphqlOperationType = faker.lorem.words();

      const createdSpan = await remoteAdapter.span.createOne({
        input: {
          spanId: faker.string.uuid(),
          graphqlSchemaHash: schema?.hash,
          name: faker.lorem.word(),
          kind: 1,
          parentSpanId: faker.string.uuid(),
          startTimeUnixNano: faker.number.int().toString(),
          endTimeUnixNano: faker.number.int().toString(),
          errorMessage: faker.lorem.words(),
          errorStack: faker.lorem.words(),
          traceId,
          traceGroupId: createdTrace?.trace?.id,
          isGraphQLRootSpan: true,
          graphqlDocument,
          graphqlOperationName,
          graphqlOperationType,
          isForeign: false,
        },
      });

      const foundSpan = await localAdapter.span.findMany({
        where: {
          spanIds: [createdSpan.span?.id],
        },
      });

      expect(foundSpan).toBeDefined();
    });
  });
});
