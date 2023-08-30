# graphql-debugger

Debug your GraphQL server locally.

## Packages

1. [ `@graphql-debugger/ui`](./packages/ui/README.md)
2. [`@graphql-debugger/collector-proxy`](./packages/collector-proxy/README.md)
3. [`@graphql-debugger/trace-schema`](./packages/trace-schema/README.md)
4. [`@graphql-debugger`](./packages/graphql-debugger/README.md)

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
