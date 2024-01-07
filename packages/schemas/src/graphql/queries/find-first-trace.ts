import { z } from "zod";

import { TraceSchema } from "../../entities/trace";

export const FindFirstTraceWhereSchema = z.object({
  traceId: z.string(),
  includeSpans: z.boolean().optional().nullable(),
});

export const FindFirstTraceResponseSchema = z.object({
  trace: TraceSchema.optional().nullable(),
});
