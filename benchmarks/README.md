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
| yoga | Node.js | http | 15.23ms | 13kps |
| yoga-otel-batch | Node.js | http | 20.70ms | 9.7kps |
| apollo | Node.js | Express | 34.08ms | 5.9kps |
| yoga-otel | Node.js | http | 35.45ms | 5.6kps |
| apollo-otel-batch | Node.js | Express | 40.40ms | 5.0kps |
| helix | Node.js | http | 47.58ms | 4.2kps |
| helix-otel-batch | Node.js | http | 54.29ms | 3.7kps |
| apollo-debugger | Node.js | Express | 54.39ms | 3.7kps |
| yoga-debugger | Node.js | http | 55.50ms | 3.6kps |
| apollo-otel | Node.js | Express | 55.78ms | 3.6kps |
| helix-otel | Node.js | http | 70.70ms | 2.8kps |
| helix-debugger | Node.js | http | 94.40ms | 2.1kps |
