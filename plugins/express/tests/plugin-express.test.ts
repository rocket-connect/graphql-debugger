import {
  InMemorySpanExporter,
  TRACER_NAME,
  setupOtel,
} from "@graphql-debugger/opentelemetry";

import express from "express";
import supertest from "supertest";

import { graphqlDebugger } from "../src";
import { HttpServerAttributeNames } from "../src/attributes";

const exporter = setupOtel({
  inMemory: true,
}) as unknown as InMemorySpanExporter;

const app = express();
app.use(express.json());
app.use(graphqlDebugger());
app.post("/graphql", (req, res) => {
  res.send("ok");
});

describe("plugin-express", () => {
  test("should wrap a route in a span and correctly propagate it", async () => {
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

    expect(spans.length).toBe(1);

    const span = spans[0];
    expect(span.name).toBe("HTTP POST /graphql");
    expect(span.attributes[HttpServerAttributeNames.HTTP_ROUTE]).toBe(
      "/graphql",
    );
    expect(
      span.attributes[HttpServerAttributeNames.CLIENT_ADDRESS],
    ).toBeDefined();
    expect(span.attributes[HttpServerAttributeNames.CLIENT_PORT]).toBeDefined();
    expect(
      span.attributes[HttpServerAttributeNames.CLIENT_SOCKET_ADDRESS],
    ).toBeDefined();
    expect(
      span.attributes[HttpServerAttributeNames.CLIENT_SOCKET_PORT],
    ).toBeDefined();
    expect(
      span.attributes[HttpServerAttributeNames.SERVER_ADDRESS],
    ).toBeDefined();
    expect(span.attributes[HttpServerAttributeNames.SERVER_PORT]).toBeDefined();
    expect(
      span.attributes[HttpServerAttributeNames.SERVER_SOCKET_ADDRESS],
    ).toBeDefined();
    expect(
      span.attributes[HttpServerAttributeNames.SERVER_SOCKET_PORT],
    ).toBeDefined();
    expect(span.attributes[HttpServerAttributeNames.URL_PATH]).toBe("/graphql");
    expect(span.attributes[HttpServerAttributeNames.URL_QUERY]).toBe("{}");

    expect(span.instrumentationLibrary.name).toBe(TRACER_NAME);
  });
});
