import { z } from "zod";

import { SpanSchema } from ".";

export const TraceSchema = z.object({
  id: z.string(),
  traceId: z.string(),
  spans: z.array(SpanSchema),
  rootSpan: SpanSchema.optional().nullable(),
  schemaId: z.string().optional().nullable(),
  firstSpanErrorMessage: z.string().optional().nullable(),
  firstSpanErrorStack: z.string().optional().nullable(),
});
