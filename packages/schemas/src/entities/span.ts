import { z } from "zod";

export const SpanSchema = z.object({
  id: z.string(),
  spanId: z.string(),
  parentSpanId: z.string().optional().nullable(),
  traceId: z.string(),
  name: z.string(),
  kind: z.string(),
  durationNano: z.string(),
  startTimeUnixNano: z.string(),
  endTimeUnixNano: z.string(),
  isForeign: z.boolean(),
  errorMessage: z.string().optional().nullable(),
  errorStack: z.string().optional().nullable(),
  graphqlDocument: z.string().optional().nullable(),
  graphqlVariables: z.string().optional().nullable(),
  graphqlResult: z.string().optional().nullable(),
  graphqlContext: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
