import {
  InMemorySpanExporter,
  TRACER_NAME,
  setupOtel,
} from "@graphql-debugger/opentelemetry";

import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import supertest from "supertest";

import { createYoga } from "../src";

const exporter = setupOtel({
  inMemory: true,
}) as unknown as InMemorySpanExporter;

const typeDefs = /* GraphQL */ `
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

describe("plugin-graphql-yoga", () => {
  afterEach(() => {
    exporter.reset();
  });

  test("should wrap graphql yoga and assert spans are created on a query", async () => {
    const yoga = createYoga({
      schema,
    });
    const app = express();
    app.use(express.json());
    app.use("/graphql", yoga);

    const query = /* GraphQL */ `
      query {
        hello
      }
    `;

    await supertest(app)
      .post("/graphql")
      .send({
        query,
      })
      .expect(200);

    const spans = exporter.getFinishedSpans();

    const span = spans[0];
    expect(span.name).toBe("query hello");
    expect(span.instrumentationLibrary.name).toBe(TRACER_NAME);
    expect(span.attributes["graphql.operation.root"]).toEqual(true);
  });

  test("should not trace schema and generate spans if disabled", async () => {
    const yoga = createYoga({
      schema,
      debugger: {
        shouldDisable: true,
      },
    });
    const app = express();
    app.use(express.json());
    app.use("/graphql", yoga);

    const query = /* GraphQL */ `
      query {
        hello
      }
    `;

    await supertest(app)
      .post("/graphql")
      .send({
        query,
      })
      .expect(200);

    const spans = exporter.getFinishedSpans();

    expect(spans.length).toBe(0);
  });
});
