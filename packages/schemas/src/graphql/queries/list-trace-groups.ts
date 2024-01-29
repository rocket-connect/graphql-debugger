import { z } from "zod";

import { TraceSchema } from "../../entities/trace";

export const ListTraceGroupsWhereSchema = z.object({
  id: z.string().optional().nullable(),
  schemaId: z.string().optional().nullable(),
  rootSpanName: z.string().optional().nullable(),
  traceIds: z.array(z.string()).optional().nullable(),
  includeSpans: z.boolean().optional().nullable(),
});

export const ListTraceGroupsResponseSchema = z.object({
  traces: z.array(TraceSchema),
});
