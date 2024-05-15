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
| [yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 14.66ms | 14kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 33.00ms | 6.0kps |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 34.22ms | 5.9kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 45.19ms | 4.4kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 53.70ms | 3.7kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 54.38ms | 3.7kps |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | Express | 55.95ms | 3.6kps |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 80.44ms | 2.5kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 82.41ms | 2.4kps |
