import { Tracer, trace } from "@opentelemetry/api";

export const TRACER_NAME = "@graphql-debugger/opentelemetry";

export function getTracer(): Tracer {
  return trace.getTracer(TRACER_NAME);
}
