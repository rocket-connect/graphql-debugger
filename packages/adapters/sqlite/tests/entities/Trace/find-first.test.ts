import { faker } from "@faker-js/faker";

import { TraceSchema } from "../../../../../schemas/build";
import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";
import { createFakeSpan } from "../../utils";

describe("Trace", () => {
  describe("findFirst", () => {
    test("should return no traces on empty database", async () => {
      const traceId = faker.datatype.uuid();

      const trace = await adapter.trace.findFirst({
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
      const traceId = faker.datatype.uuid();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      const trace = await adapter.trace.findFirst({
        where: {
          traceId: traceId,
        },
        options: {
          includeSpans: true,
        },
      });

      const parsed = TraceSchema.parse(trace);

      expect(createdTrace.id).toEqual(parsed.id);
    });

    test("should return a single trace with spans", async () => {
      const traceId = faker.datatype.uuid();

      const createdTrace = await prisma.traceGroup.create({
        data: {
          traceId,
        },
      });

      const rootSpan = await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
        isRoot: true,
      });

      const otherSpan = await createFakeSpan({
        traceGroupId: createdTrace.id,
        traceId,
      });

      const foundTrace = await adapter.trace.findFirst({
        where: {
          traceId: traceId,
        },
        options: {
          includeSpans: true,
        },
      });

      const parsed = TraceSchema.parse(foundTrace);

      expect(parsed.id).toEqual(createdTrace.id);
      expect(parsed.spans.length).toEqual(2);
      expect(parsed.rootSpan?.id).toEqual(rootSpan.id);
      expect(parsed.spans[0].id).toEqual(rootSpan.id);
      expect(parsed.spans[1].id).toEqual(otherSpan.id);
    });
  });
});
