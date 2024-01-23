import { z } from "zod";

export const ClearDBResponseSchema = z.object({
  success: z.boolean(),
});
