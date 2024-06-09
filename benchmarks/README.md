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
- yoga-debugger 
- apollo-otel-batch 
- helix-otel-batch 
- helix 
- apollo-debugger 
- apollo-otel 
- helix-debugger 
- helix-otel 

The ones tagged `otel` create a span using standard OpenTelemetry instrumentation. The ones with `otel-batch` use the OpenTelemetry batch processor to create a span, related to https://github.com/open-telemetry/opentelemetry-js/issues/4741.

The ones with `debugger` use the GraphQL Debugger to create a span. We use the standard OTEL lib's in our implementation and we use our own benchmarks to ensure quality.

Else, is a standard GraphQL server without usage of any OTEL libs. 

### Results

| Name                          | Language      | Server          | Latency avg      | Requests      |
| ----------------------------  | ------------- | --------------- | ---------------- | ------------- |
| yoga | Node.js | http | 14.61ms | 14kps |
| yoga-otel-batch | Node.js | http | 20.38ms | 9.9kps |
| apollo | Node.js | Express | 32.80ms | 6.1kps |
| yoga-otel | Node.js | http | 33.39ms | 6.0kps |
| yoga-debugger | Node.js | http | 35.88ms | 5.6kps |
| apollo-otel-batch | Node.js | Express | 39.53ms | 5.1kps |
| helix-otel-batch | Node.js | http | 51.57ms | 3.9kps |
| helix | Node.js | http | 51.73ms | 3.9kps |
| apollo-debugger | Node.js | Express | 53.00ms | 3.8kps |
| apollo-otel | Node.js | Express | 55.64ms | 3.6kps |
| helix-debugger | Node.js | http | 62.34ms | 3.2kps |
| helix-otel | Node.js | http | 68.11ms | 2.9kps |
