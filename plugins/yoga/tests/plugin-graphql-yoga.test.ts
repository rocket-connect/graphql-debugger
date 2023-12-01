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

const app = express();

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
const yoga = createYoga({
  schema,
});
app.use(express.json());
app.use("/graphql", yoga);

describe("plugin-graphql-yoga", () => {
  test("should wrap graphql yoga and assert spans are created on a query", async () => {
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
});
