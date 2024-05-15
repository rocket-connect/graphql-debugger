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
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 14.76ms | 14kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 32.53ms | 6.1kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 34.52ms | 5.8kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 47.85ms | 4.2kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 53.97ms | 3.7kps |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | Express | 55.28ms | 3.6kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 56.46ms | 3.5kps |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 68.56ms | 2.9kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 82.19ms | 2.4kps |
