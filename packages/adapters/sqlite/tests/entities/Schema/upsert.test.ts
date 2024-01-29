import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema } from "../../utils";

describe("Schema", () => {
  describe("upsert", () => {
    test("should create and return schema when it does not exist", async () => {
      const hash = faker.datatype.uuid();
      const schema = faker.datatype.uuid();

      const result = await adapter.schema.upsert({
        where: {
          hash,
        },
        input: {
          hash,
          typeDefs: schema,
        },
      });

      const foundSchema = await prisma.schema.findFirst({
        where: {
          hash,
        },
      });

      expect(result.hash).toEqual(hash);
      expect(foundSchema?.hash).toEqual(hash);
      expect(foundSchema?.typeDefs).toEqual(schema);
    });

    test("should update and return schema when it exists", async () => {
      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const newSchema = faker.datatype.uuid();

      const result = await adapter.schema.upsert({
        where: {
          hash: schema.hash,
        },
        input: {
          hash: schema.hash,
          typeDefs: newSchema,
        },
      });

      const foundSchema = await prisma.schema.findFirst({
        where: {
          hash: schema.hash,
        },
      });

      expect(result.hash).toEqual(schema.hash);
      expect(foundSchema?.hash).toEqual(schema.hash);
      expect(foundSchema?.typeDefs).toEqual(newSchema);
    });
  });
});
