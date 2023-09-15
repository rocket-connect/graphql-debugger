import { z } from "zod";

export const DeleteTracesWhereSchema = z.object({
  schemaId: z.string(),
  rootSpanName: z.string().optional().nullable(),
});

export const DeleteTracesResponseSchema = z.object({
  success: z.boolean(),
});
