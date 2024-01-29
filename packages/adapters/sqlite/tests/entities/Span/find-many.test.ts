import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Span", () => {
  describe("findMany", () => {
    test("should list no spans on empty DB", async () => {
      const foundSpans = await adapter.span.findMany({
        where: {},
      });

      expect(foundSpans.spans.length).toEqual(0);
    });

    test("should list spans by spanIds", async () => {
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

      const span1 = await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
      });

      const span2 = await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: false,
      });
      await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: false,
      });

      const foundSpans = await adapter.span.findMany({
        where: {
          spanIds: [span1.spanId, span2.spanId],
        },
      });

      expect(foundSpans.spans.length).toEqual(2);
    });

    test("should list spans by traceIds", async () => {
      const traceId1 = faker.datatype.uuid();
      const traceId2 = faker.datatype.uuid();
      const traceId3 = faker.datatype.uuid();

      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const trace1 = await prisma.traceGroup.create({
        data: {
          traceId: traceId1,
          schemaId: schema.id,
        },
      });

      const trace2 = await prisma.traceGroup.create({
        data: {
          traceId: traceId2,
          schemaId: schema.id,
        },
      });

      const trace3 = await prisma.traceGroup.create({
        data: {
          traceId: traceId3,
          schemaId: schema.id,
        },
      });

      await createFakeSpan({
        traceGroupId: trace1.id,
        traceId: traceId1,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: trace2.id,
        traceId: traceId2,
        isRoot: false,
      });

      await createFakeSpan({
        traceGroupId: trace3.id,
        traceId: traceId3,
        isRoot: false,
      });

      const foundSpans = await adapter.span.findMany({
        where: {
          traceIds: [traceId1, traceId2],
        },
      });

      expect(foundSpans.spans.length).toEqual(2);
    });

    test("should list spans by isGraphQLRootSpan", async () => {
      const traceId = faker.datatype.uuid();

      const schema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const trace = await prisma.traceGroup.create({
        data: {
          traceId,
          schemaId: schema.id,
        },
      });

      await createFakeSpan({
        traceGroupId: trace.id,
        traceId,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: trace.id,
        traceId,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: trace.id,
        traceId,
        isRoot: false,
      });

      const foundSpans = await adapter.span.findMany({
        where: {
          isGraphQLRootSpan: true,
        },
      });

      expect(foundSpans.spans.length).toEqual(2);
    });
  });
});
