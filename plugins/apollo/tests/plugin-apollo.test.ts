import {
  InMemorySpanExporter,
  setupOtel,
} from "@graphql-debugger/opentelemetry";

import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { graphqlDebuggerPlugin } from "../src";

const exporter = setupOtel({
  inMemory: true,
}) as InMemorySpanExporter;

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

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
  schema,
  plugins: [graphqlDebuggerPlugin({})],
});

beforeAll(async () => {
  await apolloServer.start();
});

describe("Apollo Server tracing", () => {
  afterEach(() => {
    exporter.reset();
  });

  it("should trace GraphQL queries", async () => {
    const query = /* GraphQL */ `
      query {
        hello
      }
    `;

    const { errors, data } = (await apolloServer.executeOperation({
      query,
    })) as unknown as {
      errors: any;
      data: any;
    };

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data?.hello).toBe("Hello world!");

    const spans = exporter.getFinishedSpans();

    expect(spans.length).toBeGreaterThan(0);
    const span = spans.find((s) => s.name.includes("hello"));
    expect(span).toBeDefined();
  });
});
