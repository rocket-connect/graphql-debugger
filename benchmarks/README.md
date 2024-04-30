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
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 18.35ms | 11kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 39.67ms | 5.0kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 43.67ms | 4.6kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 55.22ms | 3.6kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 63.86ms | 3.1kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 67.72ms | 2.9kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 105.80ms | 1.9kps |
