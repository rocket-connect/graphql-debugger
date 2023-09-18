import { z } from "zod";

import { KeyValueSchema } from "./any-value";

export const LinkSchema = z.object({
  traceId: z.string(),
  spanId: z.string(),
  traceState: z.string().optional(),
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});
