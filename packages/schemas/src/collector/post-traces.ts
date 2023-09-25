import { z } from "zod";

import { ResourceSpansSchema } from "../opentelemetry/resource-spans";

export const PostTracesSchema = z.object({
  body: z
    .object({
      resourceSpans: z.array(ResourceSpansSchema),
    })
    .required(),
});
