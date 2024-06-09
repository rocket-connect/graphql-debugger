import {
  BatchSpanProcessor,
  InMemorySpanExporter,
  ReadableSpan,
  buildSpanTree,
  setupOtel,
} from "@graphql-debugger/opentelemetry";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";

import { GraphQLDebuggerContext, traceDirective } from "../src";

const inMemorySpanExporter = setupOtel({
  inMemory: true,
  spanProcessorFactory: (exporter) => new BatchSpanProcessor(exporter),
}) as InMemorySpanExporter;

const util = require("util");
const sleep = util.promisify(setTimeout);

describe("@trace directive BatchSpanProcessor", () => {
  beforeEach(() => {
    inMemorySpanExporter.reset();
  });

  test("should trace a query", async () => {
    const typeDefs = `
          type User {
            name: String
          }
  
          type Query {
            users: [User] @trace
          }
      `;

    const resolvers = {
      Query: {
        users: async () => {
          return [{ name: "Bob", age: 100 }];
        },
      },
    };

    const trace = traceDirective();

    let schema = makeExecutableSchema({
      typeDefs: [typeDefs, trace.typeDefs],
      resolvers,
    });

    schema = trace.transformer(schema);

    const query = `
        query {
          users {
            name
          }
        }
      `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLDebuggerContext: new GraphQLDebuggerContext({ schema }),
      },
    });

    expect(errors).toBeUndefined();

    // This sleep is waiting for the batch span processor to finish processing
    await sleep(5000);

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);
    expect(spanTree.span.name).toEqual("query users");
  });
});
