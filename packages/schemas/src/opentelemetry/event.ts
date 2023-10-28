import { z } from "zod";

import { KeyValueSchema } from "./any-value";
import { UnixNanoSchema } from "./unix-nano";

export const EventSchema = z.object({
  timeUnixNano: UnixNanoSchema,
  name: z.string(),
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});
