import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Span", () => {
  describe("deleteOne", () => {
    test("should delete a span", async () => {
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

      const span = await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
      });

      await adapter.span.deleteOne({
        where: {
          id: span.id,
        },
      });

      const spans = await prisma.span.findMany({
        where: {
          id: span.id,
        },
      });

      expect(spans.length).toBe(0);
    });
  });
});
