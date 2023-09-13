import { z } from "zod";
import { TraceSchema } from "./trace";

export const SchemaSchema = z.object({
  id: z.string(),
  hash: z.string(),
  name: z.string().optional().nullable(),
  typeDefs: z.string(),
  traceGroups: z.array(TraceSchema),
  createdAt: z.string(),
});
