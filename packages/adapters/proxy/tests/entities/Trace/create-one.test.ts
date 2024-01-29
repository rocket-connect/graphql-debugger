import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Trace", () => {
  describe("createOne", () => {
    test("should create a trace", async () => {
      const traceId = faker.string.uuid();

      const createdTrace = await remoteAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      const foundTrace = await localAdapter.trace.findFirst({
        where: {
          traceId,
        },
      });

      expect(createdTrace.trace.id).toEqual(foundTrace?.id);
    });

    test("should create a trace with a schema", async () => {
      const traceId = faker.string.uuid();

      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const createdTrace = await remoteAdapter.trace.createOne({
        input: {
          traceId,
          schemaId: schema?.id,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: true,
      });

      const [foundTrace] = await localAdapter.trace.findMany({
        where: {
          schemaId: schema?.id,
        },
      });
      expect(createdTrace.trace.id).toEqual(foundTrace?.id);
      expect(createdTrace.trace.schemaId).toEqual(schema?.id);
    });
  });
});
