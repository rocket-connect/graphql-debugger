import { z } from "zod";

export const PostSchemaSchema = z.object({
  body: z
    .object({
      schema: z.string(),
    })
    .required(),
});

export type PostSchema = z.infer<typeof PostSchemaSchema>;
