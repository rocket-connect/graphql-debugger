# @graphql-debugger/collector-proxy

- [graphql-debugger.com](http://www.graphql-debugger.com)

[![npm version](https://badge.fury.io/js/@graphql-debugger%2Fui.svg)](https://badge.fury.io/js/@graphql-debugger%2Ftrace-schema) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

This is a Node.js express server exposing a GraphQL endpoint that serves the [User Interface](https://github.com/rocket-connect/graphql-debugger/tree/main/packages/ui).

This server also exposes two other HTTP endpoints:

### /v1/traces

This is a proxy endpoint around the Open Telemetry Collector's `/v1/traces` endpoint.

### /v1/schema

This is used by the [Trace Schema Package](https://github.com/rocket-connect/graphql-debugger/tree/main/packages/trace-schema), it sends the GraphQL schema here.

## Database

The collector uses a SQLite database to store traces.

SQLite is used because it is a single file database, and it is easy to setup, so we can get up and running quickly.

This does mean however, that the database is not very performant, and it is not recommended to use this in production.

We have adopoted a simple queue system to write to the database, and leveraged data loaders to batch queries.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
