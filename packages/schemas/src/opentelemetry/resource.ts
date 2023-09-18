import { z } from "zod";

import { KeyValueSchema } from "./any-value";

export const ResourceSchema = z.object({
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});
