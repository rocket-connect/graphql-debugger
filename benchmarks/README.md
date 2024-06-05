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
- yoga-debugger 
- helix-otel-batch 
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
| yoga | Node.js | http | 14.37ms | 14kps |
| yoga-otel-batch | Node.js | http | 19.85ms | 10kps |
| apollo | Node.js | Express | 31.47ms | 6.3kps |
| yoga-otel | Node.js | http | 33.55ms | 6.0kps |
| apollo-otel-batch | Node.js | Express | 38.68ms | 5.2kps |
| helix | Node.js | http | 48.21ms | 4.1kps |
| yoga-debugger | Node.js | http | 51.55ms | 3.9kps |
| helix-otel-batch | Node.js | http | 51.88ms | 3.8kps |
| apollo-debugger | Node.js | Express | 52.81ms | 3.8kps |
| apollo-otel | Node.js | Express | 54.80ms | 3.6kps |
| helix-otel | Node.js | http | 66.99ms | 3.0kps |
| helix-debugger | Node.js | http | 78.82ms | 2.5kps |
