import { z } from "zod";
import { SpanSchema } from ".";

export const TraceSchema = z.object({
  id: z.string(),
  traceId: z.string(),
  spans: z.array(SpanSchema),
  rootSpan: SpanSchema.optional(),
  firstSpanErrorMessage: z.string().optional().nullable(),
  firstSpanErrorStack: z.string().optional().nullable(),
});
