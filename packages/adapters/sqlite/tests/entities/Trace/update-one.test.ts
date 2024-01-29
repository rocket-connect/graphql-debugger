import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema } from "../../utils";

describe("Trace", () => {
  describe("updateOne", () => {
    test("should throw an error if schema is not found", async () => {
      const traceId = faker.datatype.uuid();
      const schemaId = faker.datatype.uuid();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      await expect(async () => {
        await adapter.trace.updateOne({
          where: {
            id: createdTrace.id,
          },
          input: {
            schemaId,
          },
        });
      }).rejects.toThrow();
    });

    test("should throw if no trace is found", async () => {
      const traceId = faker.datatype.uuid();
      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      await expect(async () => {
        await adapter.trace.updateOne({
          where: {
            id: traceId,
          },
          input: {
            schemaId: schema.id,
          },
        });
      }).rejects.toThrow();
    });

    test("should update the schema of a trace", async () => {
      const traceId = faker.datatype.uuid();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const updatedTrace = await adapter.trace.updateOne({
        where: {
          id: createdTrace.id,
        },
        input: {
          schemaId: schema.id,
        },
      });

      expect(updatedTrace.trace.id).toEqual(createdTrace.id);
      expect(updatedTrace.trace.schemaId).toEqual(schema.id);
    });
  });
});
