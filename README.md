# graphql-debugger

Debug your GraphQL server locally.

## Packages

1. [ `@graphql-debugger/ui`](./packages/ui/README.md) - Frontend
2. [`@graphql-debugger/collector-proxy`](./packages/collector-proxy/README.md) - Data Collector
3. [`@graphql-debugger/trace-schema`](./packages/trace-schema/README.md) - Schema Plugin
4. [`graphql-debugger`](./packages/graphql-debugger/README.md) - CLI

## Getting Started

### Install

Install the GraphQL Debugger CLI and trace schema package.

```
npm i graphql-debugger @graphql-debugger/traced-schema
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

### Debug your GraphQL server

SCREENSHOT HERE

## License

MIT - Rocket Connect - https://github.com/rocket-connect
