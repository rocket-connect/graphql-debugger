import { z } from "zod";

import { ExtractedSpanSchema } from "..";

export const ForeignTracesSchema = z.object({
  extractedSpans: z.array(ExtractedSpanSchema),
  retryCount: z.number(),
});
