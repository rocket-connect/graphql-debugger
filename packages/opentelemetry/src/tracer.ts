import { Tracer, trace } from "@opentelemetry/api";

const { name, version } = require("../package.json");

export const TRACER_NAME = name;
export const TRACER_VERSION = version;

export function getTracer(): Tracer {
  return trace.getTracer(TRACER_NAME);
}
