import { z } from "zod";

import { TraceSchema } from "../..";

export const CreateTraceInput = z.object({
  traceId: z.string(),
});

export const CreateTraceResponseSchema = z.object({
  trace: TraceSchema,
});
