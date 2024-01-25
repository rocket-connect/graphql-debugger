import { TraceSchema } from "@graphql-debugger/schemas";

import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";
import { createFakeSpan } from "../../utils";

describe("Trace", () => {
  describe("findFirst", () => {
    test("should return no traces on empty database", async () => {
      const traceId = faker.string.uuid();

      const trace = await remoteAdapter.trace.findFirst({
        where: {
          traceId,
        },
        options: {
          includeSpans: true,
        },
      });

      expect(trace).toBeNull();
    });

    test("should return a single trace", async () => {
      const traceId = faker.string.uuid();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      const trace = await remoteAdapter.trace.findFirst({
        where: {
          traceId: traceId,
        },
        options: {
          includeSpans: true,
        },
      });

      const parsed = TraceSchema.parse(trace);

      expect(createdTrace.trace.id).toEqual(parsed.id);
    });

    test("should return a single trace with spans", async () => {
      const traceId = faker.string.uuid();

      const createdTrace = await localAdapter.trace.createOne({
        input: {
          traceId,
        },
      });

      const rootSpan = await createFakeSpan({
        traceGroupId: createdTrace.trace.id,
        traceId,
        isRoot: true,
      });

      const otherSpan = await createFakeSpan({
        traceGroupId: createdTrace.trace.id,
        traceId,
      });

      const foundTrace = await remoteAdapter.trace.findFirst({
        where: {
          traceId: traceId,
        },
        options: {
          includeSpans: true,
        },
      });

      const parsed = TraceSchema.parse(foundTrace);

      expect(parsed.id).toEqual(createdTrace.trace.id);
      expect(parsed.spans.length).toEqual(2);
      expect(parsed.rootSpan?.id).toEqual(rootSpan.id);
      expect(parsed.spans[0].id).toEqual(rootSpan.id);
      expect(parsed.spans[1].id).toEqual(otherSpan.id);
    });
  });
});
