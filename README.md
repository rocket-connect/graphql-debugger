# graphql-debugger

Debug your GraphQL server locally.

- [Website](https://graphql-debugger.com)
- [Documentation](https://graphql-debugger.com/docs)

Hey 👋, welcome to the monorepo for GraphQL Debugger. This is where we develop the GraphQL Debugger frontend UI and collector proxy.

## Packages

1. `@graphql-debugger/ui` - User interface for GraphQL Debugger
2. `@graphql-debugger/collector-proxy` - Collects GraphQL queries, and serves the GraphQL Debugger UI.
3. `@graphql-debugger/traced-schema` - Tool for tracing your GraphQL schema, sending the results to the debugger.
4. `graphql-debugger` - CLI for GraphQL Debugger

## Getting Started

### Install

Install the GraphQL Debugger CLI and trace schema package.

```
npm i graphql-debugger @graphql-debugger/traced-schema
```

### Trace your schema

```ts
import { makeExecutableSchema } from '@graphql-tools/schema';
import { traceSchema } from '@graphql-debugger/traced-schema';

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
