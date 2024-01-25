import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSchema } from "../../utils";

describe("Schema", () => {
  describe("upsert", () => {
    test("should create and return schema when it does not exist", async () => {
      const hash = faker.string.uuid();
      const schema = faker.string.uuid();

      const result = await remoteAdapter.schema.upsert({
        where: {
          hash,
        },
        input: {
          hash,
          typeDefs: schema,
        },
      });

      const foundSchema = await localAdapter.schema.findFirst({
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
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });
      const hash = schema?.hash as string;

      const newSchema = faker.string.uuid();

      const result = await remoteAdapter.schema.upsert({
        where: {
          hash,
        },
        input: {
          hash,
          typeDefs: newSchema,
        },
      });
      expect(result.hash).toEqual(hash);

      const foundSchema = await localAdapter.schema.findFirst({
        where: {
          hash,
        },
      });

      expect(foundSchema?.hash).toEqual(hash);
      expect(foundSchema?.typeDefs).toEqual(newSchema);
    });
  });
});
