<!-- README.md is generated from README.ecr, do not edit -->

# GraphQL Debugger Benchmarks

Welcome to GraphQL Debugger Benchmarks! This repository contains benchmarks for various GraphQL servers.

All servers implement a simple schema:

```graphql
type Query {
  hello: String!
}
```

The returned string is always `world`.

The API is served over HTTP using a common web server and load tested using [bombardier](https://github.com/codesenberg/bombardier).

## Benchmarks

These are the servers that are benchmarked:

- yoga 
- yoga-otel-batch 
- apollo 
- yoga-otel 
- apollo-otel-batch 
- helix 
- helix-otel-batch 
- apollo-debugger 
- yoga-debugger 
- apollo-otel 
- helix-otel 
- helix-debugger 

The ones tagged `otel` create a span using standard OpenTelemetry instrumentation. The ones with `otel-batch` use the OpenTelemetry batch processor to create a span, related to https://github.com/open-telemetry/opentelemetry-js/issues/4741.

The ones with `debugger` use the GraphQL Debugger to create a span. We use the standard OTEL lib's in our implementation and we use our own benchmarks to ensure quality.

Else, is a standard GraphQL server without usage of any OTEL libs. 

### Results

| Name                          | Language      | Server          | Latency avg      | Requests      |
| ----------------------------  | ------------- | --------------- | ---------------- | ------------- |
| yoga | Node.js | http | 15.20ms | 13kps |
| yoga-otel-batch | Node.js | http | 20.64ms | 9.7kps |
| apollo | Node.js | Express | 33.42ms | 6.0kps |
| yoga-otel | Node.js | http | 34.94ms | 5.7kps |
| apollo-otel-batch | Node.js | Express | 41.53ms | 4.8kps |
| helix | Node.js | http | 48.05ms | 4.1kps |
| helix-otel-batch | Node.js | http | 55.63ms | 3.6kps |
| apollo-debugger | Node.js | Express | 55.41ms | 3.6kps |
| yoga-debugger | Node.js | http | 56.27ms | 3.5kps |
| apollo-otel | Node.js | Express | 59.68ms | 3.3kps |
| helix-otel | Node.js | http | 74.17ms | 2.7kps |
| helix-debugger | Node.js | http | 99.66ms | 2.0kps |
