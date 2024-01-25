import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSchema } from "../../utils";

describe("Trace", () => {
  describe("updateOne", () => {
    test("should throw an error if schema is not found", async () => {
      const traceId = faker.string.uuid();
      const schemaId = faker.string.uuid();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      await expect(async () => {
        await remoteAdapter.trace.updateOne({
          where: {
            id: createdTrace?.trace?.id,
          },
          input: {
            schemaId,
          },
        });
      }).rejects.toThrow();
    });

    test("should throw if no trace is found", async () => {
      const traceId = faker.string.uuid();
      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      await expect(async () => {
        await remoteAdapter.trace.updateOne({
          where: {
            id: traceId,
          },
          input: {
            schemaId: schema?.id as string,
          },
        });
      }).rejects.toThrow();
    });

    test("should update the schema of a trace", async () => {
      const traceId = faker.string.uuid();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const updatedTrace = await remoteAdapter.trace.updateOne({
        where: {
          id: createdTrace?.trace?.id,
        },
        input: {
          schemaId: schema?.id as string,
        },
      });

      expect(updatedTrace.trace.id).toEqual(createdTrace?.trace?.id);
      expect(updatedTrace.trace.schemaId).toEqual(schema?.id);
    });
  });
});
