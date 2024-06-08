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
- yoga-debugger 
- apollo-debugger 
- apollo-otel 
- helix-otel 
- helix-debugger 

The ones tagged `otel` create a span using standard OpenTelemetry instrumentation. The ones with `otel-batch` use the OpenTelemetry batch processor to create a span, related to https://github.com/open-telemetry/opentelemetry-js/issues/4741.

The ones with `debugger` use the GraphQL Debugger to create a span. We use the standard OTEL lib's in our implementation and we use our own benchmarks to ensure quality.

Else, is a standard GraphQL server without usage of any OTEL libs. 

### Results

| Name                          | Language      | Server          | Latency avg      | Requests      |
| ----------------------------  | ------------- | --------------- | ---------------- | ------------- |
| yoga | Node.js | http | 14.78ms | 14kps |
| yoga-otel-batch | Node.js | http | 20.15ms | 9.9kps |
| apollo | Node.js | Express | 32.45ms | 6.2kps |
| yoga-otel | Node.js | http | 33.97ms | 5.9kps |
| apollo-otel-batch | Node.js | Express | 40.45ms | 4.9kps |
| helix | Node.js | http | 46.86ms | 4.3kps |
| helix-otel-batch | Node.js | http | 52.23ms | 3.8kps |
| yoga-debugger | Node.js | http | 54.10ms | 3.7kps |
| apollo-debugger | Node.js | Express | 54.34ms | 3.7kps |
| apollo-otel | Node.js | Express | 55.93ms | 3.6kps |
| helix-otel | Node.js | http | 70.83ms | 2.8kps |
| helix-debugger | Node.js | http | 95.70ms | 2.1kps |
