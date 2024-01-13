import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Span", () => {
  describe("aggregate", () => {
    test("should aggregate spans", async () => {
      const traceId = faker.string.uuid();

      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
          schemaId: schema?.id,
        },
      });

      const rootSpan = await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: true,
      });

      const aggregateSpansResponse = await remoteAdapter.span.aggregate({
        where: {
          schemaId: schema?.id as string,
          name: rootSpan.name,
        },
      });

      expect(aggregateSpansResponse.resolveCount).toBe(1);
      expect(aggregateSpansResponse.errorCount).toBe(0);
    });
  });
});
