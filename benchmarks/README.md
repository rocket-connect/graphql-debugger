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
| [yoga](https://github.com/dotansimha/graphql-yoga)                   | Node.js  | http    | 15.25ms     | 13kps    |
| [apollo](https://github.com/apollographql/apollo-server)             | Node.js  | Express | 33.20ms     | 6.0kps   |
| [yoga-otel](https://github.com/open-telemetry/opentelemetry-js/)     | Node.js  | http    | 34.11ms     | 5.8kps   |
| [helix](https://github.com/contra/graphql-helix)                     | Node.js  | http    | 46.29ms     | 4.3kps   |
| [yoga-debugger](https://graphql-debugger.com/docs/plugins/yoga)      | Node.js  | http    | 89.22ms     | 2.2kps   |
| [apollo-debugger](https://graphql-debugger.com/docs/plugins/apollo)  | Node.js  | Express | 100.57ms    | 2.0kps   |
| [helix-debugger](https://github.com/rocket-connect/graphql-debugger) | Node.js  | http    | 106.46ms    | 1.9kps   |
