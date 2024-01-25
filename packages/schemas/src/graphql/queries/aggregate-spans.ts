import { z } from "zod";

export const AggregateSpansWhereSchema = z.object({
  schemaId: z.string(),
  name: z.string(),
});

export const AggregateSpansResponseSchema = z.object({
  resolveCount: z.number(),
  errorCount: z.number(),
  averageDuration: z.string(),
  lastResolved: z.string(),
});
