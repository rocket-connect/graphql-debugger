import {
  UpsertSchemaInput,
  UpsertSchemaResponseSchema,
  UpsertSchemaWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type UpsertSchemaInput = z.infer<typeof UpsertSchemaInput>;
export type UpsertSchemaWhere = z.infer<typeof UpsertSchemaWhereSchema>;
export type UpsertSchemaResponse = z.infer<typeof UpsertSchemaResponseSchema>;
