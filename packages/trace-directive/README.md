# @graphql-debugger/trace-directive

- [graphql-debugger.com](http://www.graphql-debugger.com)

[![npm version](https://badge.fury.io/js/@graphql-debugger%2Ftrace-directive.svg)](https://badge.fury.io/js/@graphql-debugger%2Ftrace-directive) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

Place the `@trace` directive on any fields you wish to trace.

```graphql
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
```

Given the query:

```graphql
query {
  users {
    name
    balance
    posts {
      title
      comments {
        content
      }
    }
  }
}
```

Outputting the following traces:

![Traces](https://user-images.githubusercontent.com/35999252/195374980-20c94be1-2836-4460-91b3-e4c1f0f2acbb.png)

## Getting Started

### Running Jaeger UI

- https://www.jaegertracing.io/

This is an open-source collector, and it comes with a graphical interface. You collect the traces and spans from your GraphQL server and send export them to here. Then, once they are sent, you can visualize them like the image above.

To start this interface, I suggest you use Docker. Here is an all-in-one script to start jager.

```
docker run --rm --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.35
```

Then you can go to http://localhost:16686/ to open the UI.

### Boilerplate

Quickstart boilerplate.

index.ts:

```ts
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  traceDirective,
  GraphQLOTELContext,
  setupOtel,
} from "@graphql-debugger/trace-directive";
import { createServer } from "@graphql-yoga/node";
import util from "util";

setupOtel();
const sleep = util.promisify(setTimeout);

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
      await sleep(200);
      return [{ name: "Dan", age: 23 }];
    },
  },
  User: {
    balance: async () => {
      await sleep(100);
      return 100;
    },
    posts: async () => {
      await sleep(500);
      return [{ title: "Beer Is Cool" }];
    },
  },
  Post: {
    comments: async () => {
      await sleep(300);
      return [
        {
          content: "I also think beer is cool",
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

const server = createServer({
  schema,
  port: 5000,
  context: {
    GraphQLOTELContext: new GraphQLOTELContext(),
  },
});

server
  .start()
  .then(() => console.log("server online"))
  .catch(console.error);
```

### Context Value

Inject the `GraphQLOTELContext` instance inside your GraphQL request context.

```js
import { GraphQLOTELContext } from "@graphql-debugger/trace-directive";

const myServer = new GraphQLServerFooBar({
  schema,
  context: {
    GraphQLOTELContext: new GraphQLOTELContext(),
  },
});
```

#### Exporting traces

This package does not export traces to your collector, you must set this up yourself. Checkout the quickstart boilerplate `setup-otel` file in this document.

## Resources

- https://www.jaegertracing.io/
- https://opentelemetry.io/
- https://www.the-guild.dev/graphql/tools/docs/schema-directives

## License

MIT - Rocket Connect - https://github.com/rocket-connect
