<!-- README.md is generated from README.ecr, do not edit -->

# GraphQL Debugger Benchmarks

https://www.graphql-debugger.com

Graphql server benchmarks in many frameworks.

All servers implement a simple schema:

```graphql
type Query {
  hello: String!
}
```

The returned string is always `world`.

The API is served over HTTP using a common web server and load tested using [bombardier](https://github.com/codesenberg/bombardier).

### Results

| Name                          | Language      | Server          | Latency avg      | Requests      |
| ----------------------------  | ------------- | --------------- | ---------------- | ------------- |
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 14.42ms | 14kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 32.77ms | 6.1kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 33.27ms | 6.0kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 50.34ms | 4.1kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 51.49ms | 3.9kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 52.54ms | 3.8kps |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | Express | 55.19ms | 3.6kps |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 66.49ms | 3.0kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 78.04ms | 2.5kps |
