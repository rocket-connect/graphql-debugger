import { faker } from "@faker-js/faker";

import { adapter } from "../../adapter";
import { createFakeSchema } from "../../utils";

describe("Schema", () => {
  describe("findMany", () => {
    test("should return no schemas on empty database", async () => {
      const schemas = await adapter.schema.findMany();

      expect(schemas).toEqual([]);
    });

    test("should return all schemas", async () => {
      await Promise.all([
        createFakeSchema({
          hash: faker.datatype.uuid(),
          schema: faker.datatype.uuid(),
        }),
        createFakeSchema({
          hash: faker.datatype.uuid(),
          schema: faker.datatype.uuid(),
        }),
        createFakeSchema({
          hash: faker.datatype.uuid(),
          schema: faker.datatype.uuid(),
        }),
      ]);

      const foundSchemas = await adapter.schema.findMany();
      expect(foundSchemas).toHaveLength(3);
    });

    test("should find schema by id", async () => {
      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const foundSchema = await adapter.schema.findMany({
        where: {
          id: schema.id,
        },
      });

      expect(foundSchema).toHaveLength(1);
      expect(foundSchema[0].id).toEqual(schema.id);
    });

    test("should find schema by schemaHashes", async () => {
      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const foundSchema = await adapter.schema.findMany({
        where: {
          schemaHashes: [schema.hash],
        },
      });

      expect(foundSchema).toHaveLength(1);
      expect(foundSchema[0].id).toEqual(schema.id);
    });
  });
});
