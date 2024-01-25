import { faker } from "@faker-js/faker";

import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Trace", () => {
  describe("findMany", () => {
    test("should return no traces on empty database", async () => {
      const traces = await adapter.trace.findMany({
        where: {},
      });

      expect(traces).toHaveLength(0);
      expect(traces).toEqual([]);
    });

    test("should not return traces if there is no root span", async () => {
      const traceId = faker.datatype.uuid();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
      });

      const traces = await adapter.trace.findMany({
        where: {},
      });

      expect(traces).toHaveLength(0);
      expect(traces).toEqual([]);
    });

    test("should return a single trace", async () => {
      const traceId = faker.datatype.uuid();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
      });

      const traces = await adapter.trace.findMany({
        where: {},
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace.id);
    });

    test("should return a single trace by id", async () => {
      const traceId = faker.datatype.uuid();
      const otherTraceId = faker.datatype.uuid();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      const otherTrace = await prisma.traceGroup.create({
        data: {
          traceId: otherTraceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: otherTrace.id,
        traceId: otherTraceId,
        isRoot: true,
      });

      const traces = await adapter.trace.findMany({
        where: {
          id: createdTrace.id,
        },
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace.id);
    });

    test("should return a single trace by schemaId", async () => {
      const traceId = faker.datatype.uuid();
      const otherTraceId = faker.datatype.uuid();

      const fakeSchema = await createFakeSchema({
        hash: faker.datatype.uuid(),
        schema: faker.datatype.uuid(),
      });

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
          schemaId: fakeSchema.id,
        },
      });

      const otherTrace = await prisma.traceGroup.create({
        data: {
          traceId: otherTraceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: otherTrace.id,
        traceId: otherTraceId,
        isRoot: true,
      });

      const traces = await adapter.trace.findMany({
        where: {
          schemaId: fakeSchema.id,
        },
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace.id);
    });

    test("should return a single trace by rootSpanName", async () => {
      const traceId = faker.datatype.uuid();
      const otherTraceId = faker.datatype.uuid();
      const rootSpanName = faker.random.word();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      const otherTrace = await prisma.traceGroup.create({
        data: {
          traceId: otherTraceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
        rootSpanName,
      });

      await createFakeSpan({
        traceGroupId: otherTrace.id,
        traceId: otherTraceId,
        isRoot: true,
      });

      const traces = await adapter.trace.findMany({
        where: {
          rootSpanName: rootSpanName,
        },
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace.id);
    });

    test("should return traces by traceIds", async () => {
      const traceId1 = faker.datatype.uuid();
      const traceId2 = faker.datatype.uuid();
      const traceId3 = faker.datatype.uuid();

      const createdTrace1 = await prisma.traceGroup.create({
        data: {
          traceId: traceId1,
        },
      });

      const createdTrace2 = await prisma.traceGroup.create({
        data: {
          traceId: traceId2,
        },
      });

      const createdTrace3 = await prisma.traceGroup.create({
        data: {
          traceId: traceId3,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace1.id,
        traceId: traceId1,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: createdTrace2.id,
        traceId: traceId2,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: createdTrace3.id,
        traceId: traceId3,
        isRoot: true,
      });

      const traces = await adapter.trace.findMany({
        where: {
          traceIds: [traceId1, traceId2],
        },
      });

      expect(traces).toHaveLength(2);
    });

    test("should include spans", async () => {
      const traceId = faker.datatype.uuid();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
      });

      const traces = await adapter.trace.findMany({
        where: {},
        includeRootSpan: true,
        includeSpans: true,
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace.id);
      expect(traces[0].spans).toHaveLength(1);
      expect(traces[0].rootSpan).toBeDefined();
      expect(traces[0].rootSpan?.id).toEqual(traces[0].spans[0].id);
    });

    test("should only take 20 traces", async () => {
      const traceId = faker.datatype.uuid();

      for (let i = 0; i < 30; i++) {
        const createdTrace = await prisma.traceGroup.create({
          data: {
            traceId: traceId + i,
          },
        });

        await createFakeSpan({
          traceGroupId: createdTrace.id,
          traceId: traceId + i,
          isRoot: true,
        });
      }

      const traces = await adapter.trace.findMany({
        where: {},
      });

      expect(traces).toHaveLength(20);
    });
  });
});
