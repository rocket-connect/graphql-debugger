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
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 15.60ms | 13kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 35.50ms | 5.6kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 36.91ms | 5.4kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 50.98ms | 3.9kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 59.85ms | 3.3kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 59.53ms | 3.3kps |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | Express | 63.40ms | 3.2kps |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 84.74ms | 2.4kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 95.64ms | 2.1kps |
