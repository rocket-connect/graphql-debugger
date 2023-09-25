import { z } from "zod";

import { KeyValueSchema } from "./any-value";

export const InstrumentationScopeSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  attributes: z.array(KeyValueSchema).optional(),
  droppedAttributesCount: z.number().optional(),
});
