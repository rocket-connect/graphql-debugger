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
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 32.61ms | 6.1kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 32.85ms | 6.1kps |
| [helix](https://github.com/contra/graphql-helix) | Node.js | http | 45.61ms | 4.4kps |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga) | Node.js | http | 51.05ms | 3.9kps |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo) | Node.js | Express | 52.67ms | 3.8kps |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | Express | 54.51ms | 3.7kps |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/) | Node.js | http | 70.93ms | 2.8kps |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js | http | 82.95ms | 2.4kps |
