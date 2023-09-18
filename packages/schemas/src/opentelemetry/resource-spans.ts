import { z } from "zod";

import { ResourceSchema } from "./resource";
import { ScopeSpansSchema } from "./scope-spans";

export const ResourceSpansSchema = z.object({
  resource: ResourceSchema.optional(),
  scopeSpans: z.array(ScopeSpansSchema),
  schemaUrl: z.string().optional(),
});
