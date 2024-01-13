import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Span", () => {
  describe("createOne", () => {
    test("should create one span", async () => {
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

      const createdSpan = await adapter.span.createOne({
        input: {
          spanId: faker.datatype.uuid(),
          parentSpanId: rootSpan.spanId,
          name: faker.random.word(),
          kind: 1,
          startTimeUnixNano: "1",
          endTimeUnixNano: "2",
          traceId,
          traceGroupId: createdTrace.id,
        },
      });

      const foundSpan = await prisma.span.findFirst({
        where: {
          id: createdSpan.span?.id,
        },
      });

      expect(foundSpan).toBeDefined();
    });
  });
});
