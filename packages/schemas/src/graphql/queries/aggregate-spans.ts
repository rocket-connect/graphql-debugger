import { z } from "zod";

import { SpanSchema } from "../..";

export const AggregateSpansWhereSchema = z.object({
  schemaId: z.string(),
  name: z.string(),
});

export const AggregateSpansResponseSchema = z.object({
  spans: z.array(SpanSchema),
  resolveCount: z.number(),
  errorCount: z.number(),
  averageDuration: z.string(),
  lastResolved: z.string(),
});
