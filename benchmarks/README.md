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
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 14.61ms | 14kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 32.40ms | 6.1kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 33.44ms | 6.0kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 47.48ms | 4.2kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 52.95ms | 3.8kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 53.76ms | 3.7kps |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | Express | 56.15ms | 3.6kps |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 67.46ms | 3.0kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 81.36ms | 2.4kps |
