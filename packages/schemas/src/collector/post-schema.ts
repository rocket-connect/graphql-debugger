import { z } from "zod";

export const PostSchemaSchema = z.object({
  body: z
    .object({
      schema: z.string(),
    })
    .required(),
});
