import { z } from "zod";

export const DeleteSpanWhere = z.object({
  id: z.string(),
});

export const DeleteSpanResponseSchema = z.object({
  success: z.boolean(),
});
