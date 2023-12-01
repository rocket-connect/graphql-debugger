# @graphql-debugger/plugin-express

- [graphql-debugger.com](http://www.graphql-debugger.com)

[![npm version](https://badge.fury.io/js/@graphql-debugger%2Fplugin-express.svg)](https://badge.fury.io/js/@graphql-debugger%2Fplugin-express) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

Express middleware for GraphQL Debugger.

The express middleware will add a span at the root of the trace for each http request to your GraphQL server.

```ts
import { graphqlDebugger } from "@graphql-debugger/plugin-express";

import express, { Express } from "express";
import { yoga } from "graphql-yoga";
import path from "path";

export const app: Express = express();
app.use(express.json());
app.use(graphqlDebugger()); // <--- Add plugin
app.use("/graphql", yoga);
```

## License

MIT - Rocket Connect - https://github.com/rocket-connect
