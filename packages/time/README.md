# @graphql-debugger/time

- [graphql-debugger.com](http://www.graphql-debugger.com)

[![npm version](https://badge.fury.io/js/@graphql-debugger%2Ftime.svg)](https://badge.fury.io/js/@graphql-debugger%2Ftime) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

The [collector](https://github.com/rocket-connect/graphql-debugger/tree/main/packages/collector-proxy) `/v1/traces` endpoint receives the following Unix Nano timestamps:

1. `startTimeUnixNano` - the time when the span started
2. `endTimeUnixNano` - the time when the span ended

The `@graphql-debugger/time` package provides functions to, store, convert and calculate the difference and offset between these timestamps plus other date and time related functions.

> The package comes bundeled with moment aswell as other Date and Number libraries. We should use this package when working with dates and times.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
