import { z } from "zod";

export const UnixNanoSchema = z.union([
  z.string(),
  z.object({
    low: z.number(),
    high: z.number(),
  }),
]);
