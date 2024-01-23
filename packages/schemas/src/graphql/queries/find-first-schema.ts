import { z } from "zod";

import { SchemaSchema } from "../../entities/schema";

export const FindFirstSchemaWhereSchema = z.object({
  hash: z.string().optional().nullable(),
});

export const FindFirstSchemaOptionsSchema = z.object({
  includeTraces: z.boolean().optional().nullable(),
});

export const FindFirstSchemaResponseSchema = z.object({
  schema: SchemaSchema.optional().nullable(),
});
