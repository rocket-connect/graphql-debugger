import {
  Attributes,
  Context,
  Span,
  SpanKind,
  SpanStatusCode,
  Tracer,
  trace,
} from "@opentelemetry/api";

export type RunInChildSpanOptions = {
  name: string;
  context: Context;
  tracer: Tracer;
  parentSpan?: Span;
  attributes?: Attributes;
};

/**
 * Simplified runInSpan function to reduce complexity and improve performance.
 * Wraps a callback within a span, setting attributes and handling errors.
 */
export async function runInSpan<R>(
  options: RunInChildSpanOptions,
  cb: (span: Span) => R | Promise<R>,
): Promise<R> {
  const { tracer, name, context, attributes } = options;

  const parentSpan = options.parentSpan;
  const traceCTX = context;
  const ctx = parentSpan ? trace.setSpan(traceCTX, parentSpan) : traceCTX;

  return tracer.startActiveSpan(
    name,
    {
      attributes,
      kind: SpanKind.INTERNAL,
    },
    ctx,
    async (span) => {
      try {
        if (attributes) {
          for (const [key, value] of Object.entries(attributes)) {
            span.setAttribute(key, value as any);
          }
        }

        return await cb(span);
      } catch (error) {
        const e = error as Error;
        span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
        span.recordException(e);
        throw error;
      } finally {
        span.end();
      }
    },
  );
}
