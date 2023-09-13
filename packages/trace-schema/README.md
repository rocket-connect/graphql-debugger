# @graphql-debugger/trace-schema

- [graphql-debugger.com](http://www.graphql-debugger.com)

[![npm version](https://badge.fury.io/js/@graphql-debugger%2Ftrace-schema.svg)](https://badge.fury.io/js/@graphql-debugger%2Ftrace-schema) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

Trace Schema wraps each field in your GraphQL schema with the [trace directive](https://github.com/rocket-connect/graphql-otel).

This directive wraps a resolver in a span.

Once the schema is traced it posts your GraphQL schema to the [GraphQL Debugger collector](https://github.com/rocket-connect/graphql-debugger/tree/main/packages/collector-proxy).

Finally, it sets up the nessessary OpenTelemetry instrumentation packages and propagators so that each trace is exported to the [collector](https://github.com/rocket-connect/graphql-debugger/tree/main/packages/collector-proxy).

## Usage

```ts
import {
  GraphQLOTELContext,
  traceSchema,
} from "@graphql-debugger/trace-schema";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { createYoga } from "graphql-yoga";

// Common GraphQL schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Wrap all resolvers and fields with tracing
const tracedSchema = traceSchema({
  schema,
});

const yoga = createYoga({
  schema: tracedSchema,
  context: (req) => {
    return {
      // Include variables, result and context in traces
      GraphQLOTELContext: new GraphQLOTELContext({
        includeVariables: true,
        includeResult: true,
        includeContext: true,
      }),
    };
  },
});
```

## License

MIT - Rocket Connect - https://github.com/rocket-connect
