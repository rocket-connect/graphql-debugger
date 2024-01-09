import { z } from "zod";

import { SpanSchema } from "../../entities/span";

export const ListSpansWhereSchema = z.object({
  spanIds: z.array(z.string()).optional().nullable(),
  traceIds: z.array(z.string()).optional().nullable(),
  isGraphQLRootSpan: z.boolean().optional().nullable(),
});

export const ListSpansResponseSchema = z.object({
  spans: z.array(SpanSchema),
});
