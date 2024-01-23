import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema } from "../../utils";

describe("Schema", () => {
  describe("createOne", () => {
    test("should return false if schema already exists", async () => {
      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const result = await adapter.schema.createOne({
        data: {
          hash: schema.hash,
          schema: schema.typeDefs,
        },
      });

      expect(result).toEqual(false);
    });

    test("should create a schema and return true", async () => {
      const hash = faker.datatype.uuid();
      const schema = faker.datatype.uuid();

      const result = await adapter.schema.createOne({
        data: {
          hash,
          schema,
        },
      });

      const foundSchema = await prisma.schema.findFirst({
        where: {
          hash,
        },
      });

      expect(result).toEqual(true);
      expect(foundSchema?.hash).toEqual(hash);
      expect(foundSchema?.typeDefs).toEqual(schema);
    });
  });
});
