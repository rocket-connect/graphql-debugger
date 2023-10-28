import { z } from "zod";

export const UnixNanoSchema = z.object({
  low: z.number(),
  high: z.number(),
});
