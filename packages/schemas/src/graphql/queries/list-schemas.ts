import { z } from "zod";

import { SchemaSchema } from "../../entities/schema";

export const ListSchemasWhereSchema = z.object({
  id: z.string().optional().nullable(),
  schemaHashes: z.array(z.string()).optional().nullable(),
});

export const ListSchemasResponseSchema = z.object({
  schemas: z.array(SchemaSchema),
});
