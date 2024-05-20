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
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 14.33ms | 14kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 31.60ms | 6.3kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 33.34ms | 6.0kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 51.59ms | 3.9kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 51.94ms | 3.8kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 53.15ms | 3.7kps |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | Express | 54.97ms | 3.6kps |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 66.98ms | 3.0kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 78.97ms | 2.5kps |
