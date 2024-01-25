import {
  createFakeSchema,
  createFakeSpan,
} from "@graphql-debugger/adapter-sqlite/tests/utils";

import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";

describe("Schema", () => {
  describe("findFirst", () => {
    test("should return no schemas on empty database", async () => {
      const foundSchema = await remoteAdapter.schema.findFirst({
        where: {
          hash: faker.string.uuid(),
        },
      });

      expect(foundSchema).toEqual(null);
    });

    test("should find schema by hash", async () => {
      const fakeSchema1 = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const foundSchema = await remoteAdapter.schema.findFirst({
        where: {
          hash: fakeSchema1.hash,
        },
      });

      expect(foundSchema?.id).toEqual(fakeSchema1.id);
    });

    test("should find schema and include traces", async () => {
      const traceId = faker.string.uuid();

      const fakeSchema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
          schemaId: fakeSchema.id,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: true,
      });

      const foundSchema = await remoteAdapter.schema.findFirst({
        where: {
          hash: fakeSchema.hash,
        },
        options: {
          includeTraces: true,
        },
      });

      expect(foundSchema?.traceGroups).toHaveLength(1);
    });
  });
});
