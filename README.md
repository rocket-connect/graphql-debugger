# graphql-debugger

Debug your GraphQL server locally.

- [Website](https://graphql-debugger.com)
- [Documentation](https://graphql-debugger.com/docs)

Hey 👋, welcome to the monorepo for GraphQL Debugger. This is where we develop the GraphQL Debugger frontend UI and collector proxy.

## Packages

1. `@graphql-debugger/ui` - User interface for GraphQL Debugger
2. `@graphql-debugger/collector-proxy` - Collects GraphQL queries, and serves the GraphQL Debugger UI.
3. `graphql-debugger` - CLI for GraphQL Debugger

## Getting started

### Prerequisites

1. [Node.js](https://nodejs.org/en/) (v18 or higher)
2. [PNPM](https://pnpm.io/) (v8 or higher)

### Installation

```bash
pnpm install
```

### Development

### UI

To run the webpack dev server for the UI:

```bash
pnpm run dev:ui
```

### Collector Proxy

To run the collector proxy:

```bash
pnpm run dev:collector-proxy
```

## License

MIT - Rocket Connect - https://github.com/rocket-connect
