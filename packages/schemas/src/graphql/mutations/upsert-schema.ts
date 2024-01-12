import { z } from "zod";

import { SchemaSchema } from "../..";

export const UpsertSchemaWhereSchema = z.object({
  hash: z.string(),
});

export const UpsertSchemaInput = z.object({
  hash: z.string(),
  typeDefs: z.string(),
});

export const UpsertSchemaResponseSchema = z.object({
  schema: SchemaSchema,
});
