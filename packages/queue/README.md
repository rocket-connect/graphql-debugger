# @graphql-debugger/queue

- [graphql-debugger.com](http://www.graphql-debugger.com)

[![npm version](https://badge.fury.io/js/@graphql-debugger%2Fqueue.svg)](https://badge.fury.io/js/@graphql-debugger%2Fqueue) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

This package contains a queue implementation for GraphQL Debugger.

When the trace schema exports spans to the collector or when it posts the schema, thoes are added to the queue.

This is done to avoid overloading the database with requests.

For now we only support in memory queue, but we plan to add a redis queue in the future.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
