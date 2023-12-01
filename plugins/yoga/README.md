# @graphql-debugger/graphql-yoga

- [graphql-debugger.com](http://www.graphql-debugger.com)

[![npm version](https://badge.fury.io/js/@graphql-debugger%2Fgraphql-yoga.svg)](https://badge.fury.io/js/@graphql-debugger%2Fgraphql-yoga) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

GraphQL Yoga integration for GraphQL Debugger.

## Installation

```bash
npm install @graphql-debugger/graphql-yoga
```

## Usage

### Running GraphQL Debugger

Run in a seperate terminal window:

```sh
npx graphql-debugger
```

### Tracing GraphQL Yoga

```ts
import { schema } from "@graphql-tools/schema";
import { createYoga } from "@graphql-debugger/graphql-yoga";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
});
```

## License

MIT - Rocket Connect - https://github.com/rocket-connect
