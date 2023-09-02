<div align="center" style="text-align: center;">

<img src="./packages/ui/public/logo.svg" width="20%" alt="GraphQL Debugger">

<h1>GraphQL Debugger</h1>

<p>Debug your GraphQL server locally.</p>

<img src="./docs/screenshot.png" width="100%" alt="GraphQL Debugger">
</div>

## About

GraphQL Debugger is a [Open Telemetry](https://opentelemetry.io/) collector with a user interface that is tailored for debugging GraphQL servers.

It is designed to be used during development, to help you spot errors, slow queries and inconsistencies without having to use console.log.

To get started, use the [trace schema package](https://github.com/rocket-connect/graphql-debugger/tree/main/packages/trace-schema) to trace your schema, and then run the GraphQL Debugger CLI to start debugging:

```
npx graphql-debugger
```

## Packages

1. [ `@graphql-debugger/ui`](./packages/ui/README.md) - Frontend
2. [`@graphql-debugger/collector-proxy`](./packages/collector-proxy/README.md) - Data Collector
3. [`@graphql-debugger/trace-schema`](./packages/trace-schema/README.md) - Schema Plugin
4. [`graphql-debugger`](./packages/graphql-debugger/README.md) - CLI

## Getting Started

### Install

Install the GraphQL Debugger CLI and trace schema package.

```
npm i graphql-debugger @graphql-debugger/trace-schema
```

### Trace your schema

```ts
import { makeExecutableSchema } from '@graphql-tools/schema';
import { traceSchema } from '@graphql-debugger/trace-schema';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const tracedSchema = traceSchema({
  schema,
});

const yoga = createYoga({
  schema: tracedSchema,
});
```

### Run the Debugger

```
npx graphql-debugger
```

## License

MIT - Rocket Connect - https://github.com/rocket-connect
