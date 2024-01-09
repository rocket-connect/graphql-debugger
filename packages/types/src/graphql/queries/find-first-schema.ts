import {
  FindFirstSchemaResponseSchema,
  FindFirstSchemaWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type FindFirstSchemaResponse = z.infer<
  typeof FindFirstSchemaResponseSchema
>;
export type FindFirstSchemaWhere = z.infer<typeof FindFirstSchemaWhereSchema>;
