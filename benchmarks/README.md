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

| Name                                                                 | Language | Server  | Latency avg | Requests |
| -------------------------------------------------------------------- | -------- | ------- | ----------- | -------- |
| [yoga](https://github.com/dotansimha/graphql-yoga)                   | Node.js  | http    | 15.14ms     | 13kps    |
| [apollo](https://github.com/apollographql/apollo-server)             | Node.js  | Express | 31.82ms     | 6.3kps   |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/)     | Node.js  | http    | 33.98ms     | 5.9kps   |
| [helix](https://github.com/contra/graphql-helix)                     | Node.js  | http    | 46.37ms     | 4.3kps   |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo)  | Node.js  | Express | 53.69ms     | 3.7kps   |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga)      | Node.js  | http    | 53.85ms     | 3.7kps   |
| [apollo-otel](https://github.com/open-telemetry/opentelemetry-js/)   | Node.js  | Express | 56.24ms     | 3.5kps   |
| [helix-otel](https://github.com/open-telemetry/opentelemetry-js/)    | Node.js  | http    | 68.50ms     | 2.9kps   |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js  | http    | 87.95ms     | 2.3kps   |
