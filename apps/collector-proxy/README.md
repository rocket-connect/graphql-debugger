# @graphql-debugger/collector-proxy

- [graphql-debugger.com](http://www.graphql-debugger.com)

[![npm version](https://badge.fury.io/js/@graphql-debugger%2Fcollector-proxy.svg)](https://badge.fury.io/js/@graphql-debugger%2Fcollector-proxy) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

The collector is a proxy ontop of the Open Telemetry Collector, it is used to collect traces from the GraphQL Debugger trace schema.

## Endpoints

### /v1/traces

This is a proxy endpoint around the Open Telemetry Collector's `/v1/traces` endpoint.

### /v1/schema

This is used by the [trace schema package](https://github.com/rocket-connect/graphql-debugger/tree/main/packages/trace-schema), it sends the GraphQL schema here.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
