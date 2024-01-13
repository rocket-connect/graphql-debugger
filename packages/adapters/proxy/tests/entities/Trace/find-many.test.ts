import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Trace", () => {
  describe("findMany", () => {
    test("should return no traces on empty database", async () => {
      const traces = await remoteAdapter.trace.findMany({
        where: {},
      });

      expect(traces).toHaveLength(0);
    });

    test("should not return traces if there is no root span", async () => {
      const traceId = faker.string.uuid();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.trace.id,
        traceId,
      });

      const traces = await remoteAdapter.trace.findMany({
        where: {},
      });

      expect(traces).toHaveLength(0);
      expect(traces).toEqual([]);
    });

    test("should return a single trace", async () => {
      const traceId = faker.string.uuid();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.trace.id,
        traceId,
        isRoot: true,
      });

      const traces = await remoteAdapter.trace.findMany({
        where: {},
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace.trace.id);
    });

    test("should return a single trace by id", async () => {
      const traceId = faker.string.uuid();
      const otherTraceId = faker.string.uuid();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      const otherTrace = await localAdapter.trace.createOne({
        input: {
          traceId: otherTraceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.trace.id,
        traceId,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: otherTrace.trace.id,
        traceId: otherTraceId,
        isRoot: true,
      });

      const traces = await remoteAdapter.trace.findMany({
        where: {
          id: createdTrace.trace.id,
        },
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace.trace.id);
    });

    test("should return a single trace by schemaId", async () => {
      const traceId = faker.string.uuid();
      const otherTraceId = faker.string.uuid();

      const fakeSchema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
          schemaId: fakeSchema?.id,
        },
      });

      const otherTrace = await localAdapter.trace.createOne({
        input: {
          traceId: otherTraceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: otherTrace?.trace?.id,
        traceId: otherTraceId,
        isRoot: true,
      });

      const traces = await remoteAdapter.trace.findMany({
        where: {
          schemaId: fakeSchema?.id,
        },
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace?.trace?.id);
    });

    test("should return a single trace by rootSpanName", async () => {
      const traceId = faker.string.uuid();
      const otherTraceId = faker.string.uuid();
      const rootSpanName = faker.lorem.word();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      const otherTrace = await localAdapter.trace.createOne({
        input: {
          traceId: otherTraceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace.trace?.id,
        traceId,
        isRoot: true,
        rootSpanName,
      });

      await createFakeSpan({
        traceGroupId: otherTrace?.trace?.id,
        traceId: otherTraceId,
        isRoot: true,
      });

      const traces = await remoteAdapter.trace.findMany({
        where: {
          rootSpanName: rootSpanName,
        },
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace?.trace?.id);
    });

    test("should return traces by traceIds", async () => {
      const traceId1 = faker.string.uuid();
      const traceId2 = faker.string.uuid();
      const traceId3 = faker.string.uuid();

      const createdTrace1 = await localAdapter.trace.createOne({
        input: {
          traceId: traceId1,
        },
      });

      const createdTrace2 = await localAdapter.trace.createOne({
        input: {
          traceId: traceId2,
        },
      });

      const createdTrace3 = await localAdapter.trace.createOne({
        input: {
          traceId: traceId3,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace1?.trace?.id,
        traceId: traceId1,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: createdTrace2?.trace?.id,
        traceId: traceId2,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: createdTrace3?.trace?.id,
        traceId: traceId3,
        isRoot: true,
      });

      const traces = await remoteAdapter.trace.findMany({
        where: {
          traceIds: [traceId1, traceId2],
        },
      });

      expect(traces).toHaveLength(2);
    });

    test("should include spans", async () => {
      const traceId = faker.string.uuid();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: true,
      });

      const traces = await remoteAdapter.trace.findMany({
        where: {},
        includeRootSpan: true,
        includeSpans: true,
      });

      expect(traces).toHaveLength(1);
      expect(traces[0].id).toEqual(createdTrace?.trace?.id);
      expect(traces[0].spans).toHaveLength(1);
      expect(traces[0].rootSpan).toBeDefined();
      expect(traces[0].rootSpan?.id).toEqual(traces[0].spans[0].id);
    });

    test("should only take 20 traces", async () => {
      const traceId = faker.string.uuid();

      for (let i = 0; i < 30; i++) {
        const createdTrace = await localAdapter.trace.createOne({
          input: {
            traceId: traceId + i,
          },
        });

        await createFakeSpan({
          traceGroupId: createdTrace?.trace?.id,
          traceId: traceId + i,
          isRoot: true,
        });
      }

      const traces = await remoteAdapter.trace.findMany({
        where: {},
      });

      expect(traces).toHaveLength(20);
    });
  });
});
