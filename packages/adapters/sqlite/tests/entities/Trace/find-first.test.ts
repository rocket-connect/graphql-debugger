import { Span } from "@graphql-debugger/data-access";

import { faker } from "@faker-js/faker";

import { TraceSchema } from "../../../../../schemas/build";
import { prisma } from "../../../src/prisma";
import { adapter } from "../../adapter";

async function createFakeSpan({
  traceGroupId,
  traceId,
  isRoot,
}: {
  traceGroupId: string;
  traceId: string;
  isRoot?: boolean;
}): Promise<Span> {
  const spanId = faker.datatype.uuid();
  const parentSpanId = faker.datatype.uuid();
  const name = faker.random.word();
  const kind = faker.random.word();
  const startTimeUnixNano = faker.datatype.number();
  const endTimeUnixNano = faker.datatype.number();
  const errorMessage = faker.random.words();
  const errorStack = faker.random.words();
  const graphqlDocument = faker.random.words();
  const graphqlVariables = faker.random.words();
  const graphqlResult = faker.random.words();
  const graphqlContext = faker.random.words();
  const graphqlSchemaHash = faker.random.words();
  const graphqlOperationName = faker.random.words();
  const graphqlOperationType = faker.random.words();
  const isForeign = faker.datatype.boolean();

  const span = await prisma.span.create({
    data: {
      spanId: spanId,
      parentSpanId: parentSpanId,
      name: name,
      kind: kind,
      startTimeUnixNano: startTimeUnixNano,
      endTimeUnixNano: endTimeUnixNano,
      traceId,
      traceGroupId,
      errorMessage: errorMessage,
      errorStack: errorStack,
      graphqlDocument: graphqlDocument,
      graphqlVariables: graphqlVariables,
      graphqlResult: graphqlResult,
      graphqlContext: graphqlContext,
      graphqlSchemaHash: graphqlSchemaHash,
      graphqlOperationName: graphqlOperationName,
      durationNano: endTimeUnixNano - startTimeUnixNano,
      graphqlOperationType: graphqlOperationType,
      isForeign: isForeign,
      isGraphQLRootSpan: isRoot || false,
    },
  });

  return span;
}

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
        include: {
          spans: true,
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
