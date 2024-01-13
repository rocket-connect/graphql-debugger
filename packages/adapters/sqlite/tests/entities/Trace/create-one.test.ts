import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema } from "../../utils";

describe("Trace", () => {
  describe("createOne", () => {
    test("should create a trace", async () => {
      const traceId = faker.datatype.uuid();

      const createdTrace = await adapter.trace.createOne({
        input: {
          traceId,
        },
      });

      const foundTrace = await prisma.traceGroup.findFirst({
        where: {
          traceId,
        },
      });

      expect(createdTrace.trace.id).toEqual(foundTrace?.id);
    });

    test("should create a trace with a schema", async () => {
      const traceId = faker.datatype.uuid();

      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const createdTrace = await adapter.trace.createOne({
        input: {
          traceId,
          schemaId: schema.id,
        },
      });

      const foundTrace = await prisma.traceGroup.findFirst({
        where: {
          schemaId: schema.id,
        },
      });

      expect(createdTrace.trace.id).toEqual(foundTrace?.id);
      expect(createdTrace.trace.schemaId).toEqual(schema.id);
    });
  });
});
