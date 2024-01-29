import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Span", () => {
  describe("deleteOne", () => {
    test("should delete a span", async () => {
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

      const span = await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: true,
      });

      const { success } = await remoteAdapter.span.deleteOne({
        where: {
          id: span.id,
        },
      });

      expect(success).toBe(true);

      const { spans } = await localAdapter.span.findMany({
        where: {
          spanIds: [span.id],
        },
      });

      expect(spans.length).toBe(0);
    });
  });
});
