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
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 15.48ms | 13kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 33.15ms | 6.0kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 34.25ms | 5.9kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 47.91ms | 4.2kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 87.01ms | 2.3kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 96.14ms | 2.1kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 105.82ms | 1.9kps |
