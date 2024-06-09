export * from "./setup-otel";
export * from "./build-span-tree";
export * from "./run-in-span";
export * from "./attributes-to-object";
export * from "./extract-spans";
export * from "./info-to-attributes";
export * from "./info-to-span-name";
export * from "./tracer";

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

export { InstrumentationOption } from "@opentelemetry/instrumentation";

export { Span as ApiSpan } from "@opentelemetry/api";

export {
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
