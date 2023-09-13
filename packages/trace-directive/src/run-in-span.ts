import {
  Context,
  Span,
  SpanKind,
  SpanStatusCode,
  Tracer,
  Attributes,
  RandomIdGenerator,
} from "@graphql-debugger/opentelemetry";

export type RunInChildSpanOptions = {
  name: string;
  context: Context;
  tracer: Tracer;
  parentSpan?: Span;
  attributes?: Attributes;
};

export async function runInSpan<R>(
  options: RunInChildSpanOptions,
  cb: (span: Span) => R | Promise<R>,
) {
  if (options.parentSpan) {
    const parentContext = options.parentSpan.spanContext();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const span = new Span(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options.tracer,
      options.context,
      options.name,
      {
        traceId: parentContext.traceId,
        spanId: new RandomIdGenerator().generateSpanId(),
        traceFlags: 1,
      },
      SpanKind.INTERNAL,
      parentContext.spanId,
    );

    Object.entries(options.attributes || {}).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });

    try {
      return await cb(span);
    } catch (error) {
      const e = error as Error;
      span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
      span.recordException(e);
      throw error;
    } finally {
      span.end();
    }
  }

  return options.tracer.startActiveSpan(
    options.name,
    { attributes: options.attributes },
    options.context,
    async (span) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
