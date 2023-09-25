import { z } from "zod";

import { KeyValueSchema } from "./any-value";

export const EventSchema = z.object({
  timeUnixNano: z.number(),
  name: z.string(),
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});
