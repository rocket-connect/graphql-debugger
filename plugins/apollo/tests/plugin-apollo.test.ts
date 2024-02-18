import {
  InMemorySpanExporter,
  setupOtel,
} from "@graphql-debugger/opentelemetry";

import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import util from "util";

import { graphqlDebuggerPlugin } from "../src";

const exporter = setupOtel({
  inMemory: true,
}) as InMemorySpanExporter;

const sleep = util.promisify(setTimeout);

const posts = [
  {
    title: "Hello world",
    author: {
      name: "John Doe",
    },
  },
];

const typeDefs = /* GraphQL */ `
  type Query {
    posts: [Post]!
  }

  type Post {
    title: String!
    author: User!
  }

  type User {
    name: String!
  }
`;

const resolvers = {
  Query: {
    posts: async () => {
      await sleep(1000);

      return posts;
    },
  },
  User: {
    name: async (root: any) => {
      await sleep(1000);

      return root.name;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
  schema,
  plugins: [graphqlDebuggerPlugin()],
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
      query Query {
        posts {
          title
          author {
            name
          }
        }
      }
    `;

    const {
      body: {
        singleResult: { data, errors },
      },
    } = (await apolloServer.executeOperation({
      query,
    })) as unknown as {
      body: {
        singleResult: {
          errors: any;
          data: any;
        };
      };
    };

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data?.posts).toEqual(posts);

    const spans = exporter.getFinishedSpans();
    expect(spans.length).toBe(4);

    const rootSpan = spans.find((span) => !span.parentSpanId);
    expect(rootSpan).toBeDefined();
    expect(rootSpan?.name).toBe("query posts");

    const postTitleSpan = spans.find(
      (span) =>
        span.name === "Post title" &&
        span.parentSpanId === rootSpan?.spanContext().spanId,
    );
    expect(postTitleSpan).toBeDefined();

    const authorSpan = spans.find(
      (span) =>
        span.name === "Post author" &&
        span.parentSpanId === rootSpan?.spanContext().spanId,
    );
    expect(authorSpan).toBeDefined();

    const authorNameSpan = spans.find(
      (span) =>
        span.name === "User name" &&
        span.parentSpanId === authorSpan?.spanContext().spanId,
    );
    expect(authorNameSpan).toBeDefined();
  });
});
