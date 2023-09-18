export * from "./setup-otel";
export * from "./build-span-tree";
export * from "./run-in-span";
export * from "./attributes-to-object";

export { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
export {
  Span,
  InMemorySpanExporter,
  ReadableSpan,
  RandomIdGenerator,
} from "@opentelemetry/sdk-trace-base";
export {
  Context,
  trace,
  Tracer,
  context,
  SpanStatusCode,
  SpanKind,
  Attributes,
} from "@opentelemetry/api";
