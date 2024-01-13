import { TraceSchema } from "@graphql-debugger/schemas";
import { Span } from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";

import { localAdapter, remoteAdapter } from "../../adapters";

async function createFakeSpan({
  traceGroupId,
  traceId,
  isRoot,
}: {
  traceGroupId: string;
  traceId: string;
  isRoot?: boolean;
}): Promise<Span> {
  const spanId = faker.string.uuid();
  const parentSpanId = faker.string.uuid();
  const name = faker.lorem.word();
  const kind = faker.number.int();
  const startTimeUnixNano = faker.number.int().toString();
  const endTimeUnixNano = faker.number.int().toString();
  const errorMessage = faker.lorem.words();
  const errorStack = faker.lorem.words();
  const graphqlDocument = faker.lorem.words();
  const graphqlVariables = faker.lorem.words();
  const graphqlResult = faker.lorem.words();
  const graphqlContext = faker.lorem.words();
  const graphqlSchemaHash = faker.lorem.words();
  const graphqlOperationName = faker.lorem.words();
  const graphqlOperationType = faker.lorem.words();
  const isForeign = faker.datatype.boolean();

  const { span } = await localAdapter.span.createOne({
    input: {
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
