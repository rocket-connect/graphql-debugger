import { z } from "zod";

import { InstrumentationScopeSchema } from "./instrumentation-scope";
import { OTELSpanSchema } from "./span";

export const ScopeSpansSchema = z.object({
  scope: InstrumentationScopeSchema.optional(),
  spans: z.array(OTELSpanSchema),
  schemaUrl: z.string().nullable().optional(),
});
