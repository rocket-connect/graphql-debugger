import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSchema, createFakeSpan } from "../../utils";

describe("Span", () => {
  describe("findMany", () => {
    test("should list no spans on empty DB", async () => {
      const foundSpans = await remoteAdapter.span.findMany({
        where: {},
      });

      expect(foundSpans.spans.length).toEqual(0);
    });

    test("should list spans by spanIds", async () => {
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

      const span1 = await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: true,
      });

      const span2 = await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: false,
      });
      await createFakeSpan({
        traceGroupId: createdTrace?.trace?.id,
        traceId,
        isRoot: false,
      });

      const foundSpans = await remoteAdapter.span.findMany({
        where: {
          spanIds: [span1.spanId, span2.spanId],
        },
      });

      expect(foundSpans.spans.length).toEqual(2);
    });

    test("should list spans by traceIds", async () => {
      const traceId1 = faker.string.uuid();
      const traceId2 = faker.string.uuid();
      const traceId3 = faker.string.uuid();

      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const trace1 = await localAdapter.trace.createOne({
        input: {
          traceId: traceId1,
          schemaId: schema?.id,
        },
      });

      const trace2 = await localAdapter.trace.createOne({
        input: {
          traceId: traceId2,
          schemaId: schema?.id,
        },
      });

      const trace3 = await localAdapter.trace.createOne({
        input: {
          traceId: traceId3,
          schemaId: schema?.id,
        },
      });

      await createFakeSpan({
        traceGroupId: trace1?.trace?.id,
        traceId: traceId1,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: trace2?.trace?.id,
        traceId: traceId2,
        isRoot: false,
      });

      await createFakeSpan({
        traceGroupId: trace3?.trace?.id,
        traceId: traceId3,
        isRoot: false,
      });

      const foundSpans = await remoteAdapter.span.findMany({
        where: {
          traceIds: [traceId1, traceId2],
        },
      });

      expect(foundSpans.spans.length).toEqual(2);
    });

    test("should list spans by isGraphQLRootSpan", async () => {
      const traceId = faker.string.uuid();

      const schema = await createFakeSchema({
        hash: faker.string.uuid(),
        schema: faker.string.uuid(),
      });

      const trace = await localAdapter.trace.createOne({
        input: {
          traceId,
          schemaId: schema?.id,
        },
      });

      await createFakeSpan({
        traceGroupId: trace?.trace?.id,
        traceId,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: trace?.trace?.id,
        traceId,
        isRoot: true,
      });

      await createFakeSpan({
        traceGroupId: trace?.trace.id,
        traceId,
        isRoot: false,
      });

      const foundSpans = await remoteAdapter.span.findMany({
        where: {
          isGraphQLRootSpan: true,
        },
      });

      expect(foundSpans.spans.length).toEqual(2);
    });
  });
});
