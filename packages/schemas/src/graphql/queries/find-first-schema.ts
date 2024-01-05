import { z } from "zod";

import { SchemaSchema } from "../../entities/schema";

export const FindFirstSchemaWhereSchema = z.object({
  hash: z.string(),
});

export const FindFirstSchemaResponseSchema = z.object({
  schema: SchemaSchema.optional().nullable(),
});
