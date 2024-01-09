import { z } from "zod";

import { TraceSchema } from "../..";

export const UpdateTraceWhereSchema = z.object({
  id: z.string(),
});

export const UpdateTraceInput = z.object({
  schemaId: z.string(),
});

export const UpdateTraceResponseSchema = z.object({
  trace: TraceSchema,
});
