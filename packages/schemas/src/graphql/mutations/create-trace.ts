import { z } from "zod";

import { TraceSchema } from "../..";

export const CreateTraceInput = z.object({
  traceId: z.string(),
  schemaId: z.string().optional().nullable(),
});

export const CreateTraceResponseSchema = z.object({
  trace: TraceSchema,
});
