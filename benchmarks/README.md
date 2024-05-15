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
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 15.29ms | 13kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 33.68ms | 5.9kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 34.58ms | 5.8kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 47.27ms | 4.2kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 55.80ms | 3.6kps |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | Express | 56.16ms | 3.6kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 56.56ms | 3.5kps |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 69.46ms | 2.9kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 98.21ms | 2.0kps |
