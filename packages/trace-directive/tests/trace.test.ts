import {
  InMemorySpanExporter,
  ReadableSpan,
  SpanStatusCode,
  buildSpanTree,
  setupOtel,
} from "@graphql-debugger/opentelemetry";
import { AttributeNames } from "@graphql-debugger/types";

import { makeExecutableSchema } from "@graphql-tools/schema";
import crypto from "crypto";
import {
  graphql,
  lexicographicSortSchema,
  parse,
  print,
  printSchema,
} from "graphql";

import { GraphQLDebuggerContext, traceDirective } from "../src";

const inMemorySpanExporter = setupOtel({
  inMemory: true,
}) as InMemorySpanExporter;

const util = require("util");
const sleep = util.promisify(setTimeout);

describe("@trace directive", () => {
  beforeEach(() => {
    inMemorySpanExporter.reset();
  });

  test("should throw an error if context is not set", async () => {
    const typeDefs = `
      type User {
        name: String @trace
      }

      type Query {
        users: [User] @trace
      }
    `;

    const resolvers = {
      Query: {
        users: () => {
          return [{ name: "Dan" }];
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
        // GraphQLDebuggerContext: new GraphQLDebuggerContext(),
      },
    });

    const error = ((errors || [])[0] as unknown as Error).message;

    expect(error).toContain("contextValue.GraphQLDebuggerContext missing");
  });

  test("should trace a query", async () => {
    const typeDefs = `
        type User {
          name: String
          age: Int
          balance: Int @trace
          posts: [Post] @trace
        }

        type Post {
          title: String
          comments: [Comment] @trace
        }

        type Comment {
          content: String
        }
        
        type Query {
          users: [User] @trace
        }
    `;

    const resolvers = {
      Query: {
        users: async () => {
          // Simulate time
          await sleep(200);

          return [{ name: "Dan", age: 23 }];
        },
      },
      User: {
        balance: async () => {
          // Simulate complex lookup
          await sleep(100);

          return 100;
        },
        posts: async () => {
          // Simulate a join
          await sleep(500);
          return [{ title: "Cake Is Cool" }];
        },
      },
      Post: {
        comments: async (
          source,
          args,
          context: { GraphQLDebuggerContext: GraphQLDebuggerContext },
        ) => {
          const childSpanInput = {
            name: "test-child-span",
            cb: async () => {
              await sleep(300);
            },
            graphqlContext: context,
          };

          await context.GraphQLDebuggerContext.runInChildSpan(childSpanInput);

          // Simulate a join
          await sleep(300);

          return [
            {
              content: "I also think cake is cool",
            },
          ];
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
          age
          balance
          posts {
            title
            comments {
              content
            }
          }
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLDebuggerContext: new GraphQLDebuggerContext(),
      },
    });

    expect(errors).toBeUndefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("query users");
    expect(spanTree.span.attributes[AttributeNames.DOCUMENT]).toMatch(
      print(parse(query)),
    );
    expect(spanTree.span.attributes[AttributeNames.OPERATION_NAME]).toMatch(
      "users",
    );
    expect(spanTree.span.attributes[AttributeNames.OPERATION_TYPE]).toMatch(
      "query",
    );

    const balanceSpan = spanTree.children.find(
      (child) => child.span.name === "User balance",
    );
    expect(balanceSpan).toBeDefined();

    const postsSpan = spanTree.children.find(
      (child) => child.span.name === "User posts",
    );
    expect(postsSpan).toBeDefined();

    const commentsSnap = postsSpan!.children.find(
      (child) => child.span.name === "Post comments",
    );
    expect(commentsSnap).toBeDefined();

    const testChildSpan = commentsSnap!.children.find(
      (child) => child.span.name === "test-child-span",
    );
    expect(testChildSpan).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(commentsSnap!.span._spanContext.spanId).toEqual(
      testChildSpan!.span.parentSpanId,
    );
  });

  test("should trace a mutation", async () => {
    const typeDefs = `
        type User {
          name: String
          age: Int
          posts: [Post] @trace
        }

        type Post {
          title: String
        }

        type Mutation {
          createUser(name: String, age: Int): User @trace
        }

        type Query {
          _root_type_must_be_provided: User
        }
    `;

    const resolvers = {
      Mutation: {
        createUser: (_: any, args: { name: string; age: number }) => {
          return [
            {
              name: args.name,
              age: args.age,
              posts: [{ title: "Beer Is Cool" }],
            },
          ];
        },
      },
      Query: {
        _root_type_must_be_provided: () => ({ name: "Dan", age: 23 }),
      },
    };

    const trace = traceDirective();

    let schema = makeExecutableSchema({
      typeDefs: [typeDefs, trace.typeDefs],
      resolvers,
    });

    schema = trace.transformer(schema);

    const query = `
      mutation {
        createUser(name: "Dan", age: 23) {
          name
          age
          posts {
            title
          }
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLDebuggerContext: new GraphQLDebuggerContext({
          includeVariables: true,
        }),
      },
    });

    expect(errors).toBeUndefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("mutation createUser");
    expect(spanTree.span.attributes[AttributeNames.DOCUMENT]).toMatch(
      print(parse(query)),
    );

    const postsSpan = spanTree.children.find(
      (child) => child.span.name === "User posts",
    );
    expect(postsSpan).toBeDefined();
  });

  test("should append graphql error to trace", async () => {
    const randomString = Math.random().toString(36).substring(7);

    const typeDefs = `
      type User {
        name: String
        age: Int
      }

      type Query {
        users: [User] @trace
      }
    `;

    const resolvers = {
      Query: {
        users: async () => {
          throw new Error(randomString);
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
          age
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLDebuggerContext: new GraphQLDebuggerContext(),
      },
    });

    expect(errors).toBeDefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("query users");
    expect(spanTree.span.attributes[AttributeNames.DOCUMENT]).toMatch(
      print(parse(query)),
    );

    const events = spanTree.span.events;

    const errorEvent = events.find(
      (e) => (e.attributes as any)["exception.message"] === randomString,
    );

    expect(errorEvent).toBeDefined();

    const errorStatus = spanTree.span.status;
    expect(errorStatus).toBeDefined();
    expect(errorStatus.code).toEqual(SpanStatusCode.ERROR);
    expect(errorStatus.message).toEqual(randomString);
  });

  test("should append graphql variables and context to trace", async () => {
    const randomName = Math.random().toString(36).substring(7);
    const excludeContext = Math.random().toString(36).substring(7);

    const typeDefs = `
      type User {
        name: String
        age: Int
      }

      type Query {
        users(name: String!): [User] @trace
      }
    `;

    const resolvers = {
      Query: {
        users: async (root, { name }) => {
          return [{ name, age: 23 }];
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
      query($name: String!) {
        users(name: $name) {
          name
          age
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      variableValues: {
        name: randomName,
      },
      contextValue: {
        name: randomName,
        [excludeContext]: excludeContext,
        GraphQLDebuggerContext: new GraphQLDebuggerContext(),
        req: {
          url: "http://localhost:3000/graphql",
        },
        _req: {
          url: "http://localhost:3000/graphql",
        },
        request: {
          url: "http://localhost:3000/graphql",
        },
        _request: {
          url: "http://localhost:3000/graphql",
        },
        res: {
          statusCode: 200,
        },
        _res: {
          statusCode: 200,
        },
        params: {
          statusCode: 200,
        },
        _params: {
          statusCode: 200,
        },
        someFunction: () => {},
      },
    });

    expect(errors).toBeUndefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("query users");
    expect(spanTree.span.attributes[AttributeNames.DOCUMENT]).toMatch(
      print(parse(query)),
    );
    expect(
      spanTree.span.attributes[AttributeNames.OPERATION_RETURN_TYPE],
    ).toMatch("[User]");
  });

  test("should append graphql result to trace attribute", async () => {
    const randomString = Math.random().toString(36).substring(7);

    const typeDefs = `
      type User {
        name: String @trace
        age: String @trace
      }

      type Query {
        user: User @trace
      }
    `;

    const resolvers = {
      Query: {
        user: () => ({ name: randomString, age: "23" }),
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
        user {
          name
          age
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLDebuggerContext: new GraphQLDebuggerContext({
          includeResult: true,
        }),
      },
    });

    expect(errors).toBeUndefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("query user");
    expect(spanTree.span.attributes[AttributeNames.DOCUMENT]).toMatch(
      print(parse(query)),
    );

    const nameSpan = spanTree.children.find(
      (child) => child.span.name === "User name",
    );
    expect(nameSpan).toBeDefined();
  });

  test("should append graphql schema hash to trace attribute", async () => {
    const randomString = Math.random().toString(36).substring(7);

    const typeDefs = `
      type User {
        name: String @trace
      }

      type Query {
        user: User @trace
      }
    `;

    const resolvers = {
      Query: {
        user: () => ({ name: randomString }),
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
        user {
          name
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLDebuggerContext: new GraphQLDebuggerContext({
          includeResult: true,
        }),
      },
    });

    expect(errors).toBeUndefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("query user");
    expect(spanTree.span.attributes[AttributeNames.DOCUMENT]).toMatch(
      print(parse(query)),
    );

    const result = spanTree.span.attributes[AttributeNames.SCHEMA_HASH];

    const sorted = lexicographicSortSchema(schema);
    const printed = printSchema(sorted);

    const hash = crypto.createHash("sha256");
    hash.update(printed);

    expect(result).toEqual(hash.digest("hex"));
  });

  // https://github.com/rocket-connect/graphql-debugger/issues/66
  test("should append graphql bottom values to trace attribute", async () => {
    const typeDefs = `
      type Query {
        hello: String! @trace
      }
    `;

    const resolvers = {
      Query: {
        hello: () => "world",
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
        hello
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLDebuggerContext: new GraphQLDebuggerContext({
          includeVariables: true,
          includeResult: true,
          includeContext: true,
        }),
      },
    });

    expect(errors).toBeUndefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("query hello");
    expect(spanTree.span.attributes[AttributeNames.DOCUMENT]).toMatch(
      print(parse(query)),
    );
  });
});
