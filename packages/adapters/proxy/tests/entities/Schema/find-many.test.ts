import { createFakeSchema } from "@graphql-debugger/adapter-sqlite/tests/utils";

import { faker } from "@faker-js/faker";

import { remoteAdapter } from "../../adapters";

describe("Schema", () => {
  describe("findMany", () => {
    test("should return no schemas on empty database", async () => {
      const schemas = await remoteAdapter.schema.findMany();

      expect(schemas).toEqual([]);
    });

    test("should return all schemas", async () => {
      await Promise.all([
        createFakeSchema({
          hash: faker.string.uuid(),
          schema: faker.string.uuid(),
        }),
        createFakeSchema({
          hash: faker.string.uuid(),
          schema: faker.string.uuid(),
        }),
        createFakeSchema({
          hash: faker.string.uuid(),
          schema: faker.string.uuid(),
        }),
      ]);

      const foundSchemas = await remoteAdapter.schema.findMany();
      expect(foundSchemas).toHaveLength(3);
    });

    test("should find schema by id", async () => {
      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const foundSchema = await remoteAdapter.schema.findMany({
        where: {
          id: schema.id,
        },
      });

      expect(foundSchema).toHaveLength(1);
      expect(foundSchema[0].id).toEqual(schema.id);
    });

    test("should find schema by schemaHashes", async () => {
      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const foundSchema = await remoteAdapter.schema.findMany({
        where: {
          schemaHashes: [schema.hash],
        },
      });

      expect(foundSchema).toHaveLength(1);
      expect(foundSchema[0].id).toEqual(schema.id);
    });
  });
});
