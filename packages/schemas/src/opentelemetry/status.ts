import { z } from "zod";

export const StatusSchema = z.object({
  message: z.string().optional(),
  code: z.number(),
});
