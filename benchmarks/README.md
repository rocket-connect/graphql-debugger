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
- apollo 
- yoga-otel 
- helix 
- yoga-debugger 
- apollo-debugger 
- apollo-otel 
- helix-otel 
- helix-debugger 

The ones tagged `otel` create a span using standard OpenTelemetry instrumentation. 

The ones with `debugger` use the GraphQL Debugger to create a span. We use the standard OTEL lib's in our implementation and we use our own benchmarks to ensure quality.

Else, is a standard GraphQL server without usage of any OTEL libs. 

### Results

| Name                          | Language      | Server          | Latency avg      | Requests      |
| ----------------------------  | ------------- | --------------- | ---------------- | ------------- |
| yoga | Node.js | http | 14.78ms | 14kps |
| apollo | Node.js | Express | 33.34ms | 6.0kps |
| yoga-otel | Node.js | http | 33.88ms | 5.9kps |
| helix | Node.js | http | 49.39ms | 4.0kps |
| yoga-debugger | Node.js | http | 52.72ms | 3.8kps |
| apollo-debugger | Node.js | Express | 54.92ms | 3.6kps |
| apollo-otel | Node.js | Express | 55.51ms | 3.6kps |
| helix-otel | Node.js | http | 68.83ms | 2.9kps |
| helix-debugger | Node.js | http | 81.92ms | 2.4kps |
