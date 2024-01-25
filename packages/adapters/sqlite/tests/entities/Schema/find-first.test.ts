import { faker } from "@faker-js/faker";

import { adapter } from "../../adapter";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Schema", () => {
  describe("findFirst", () => {
    test("should return no schemas on empty database", async () => {
      const foundSchema = await adapter.schema.findFirst({
        where: {
          hash: faker.datatype.uuid(),
        },
      });

      expect(foundSchema).toEqual(null);
    });

    test("should return first schema", async () => {
      const fakeSchema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const foundSchema = await adapter.schema.findFirst({
        where: {},
      });

      expect(foundSchema?.hash).toEqual(fakeSchema.hash);
    });

    test("should find schema by hash", async () => {
      const fakeSchema1 = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const foundSchema = await adapter.schema.findFirst({
        where: {
          hash: fakeSchema1.hash,
        },
      });

      expect(foundSchema?.id).toEqual(fakeSchema1.id);
    });

    test("should find schema and include traces", async () => {
      const traceId = faker.datatype.uuid();

      const fakeSchema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const createdTrace = await adapter.trace.createOne({
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

      const foundSchema = await adapter.schema.findFirst({
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
