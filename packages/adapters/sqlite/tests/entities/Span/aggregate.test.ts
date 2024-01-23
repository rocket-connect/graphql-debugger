import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Span", () => {
  describe("aggregate", () => {
    test("should aggregate spans", async () => {
      const traceId = faker.datatype.uuid();

      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
          schemaId: schema.id,
        },
      });

      const rootSpan = await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
      });

      const aggregateSpansResponse = await adapter.span.aggregate({
        where: {
          schemaId: schema.id,
          name: rootSpan.name,
        },
      });

      expect(aggregateSpansResponse.resolveCount).toBe(1);
      expect(aggregateSpansResponse.errorCount).toBe(0);
    });
  });
});
