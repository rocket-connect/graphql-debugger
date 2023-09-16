import {
  ListSchemasResponseSchema,
  ListSchemasWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type ListSchemasResponse = z.infer<typeof ListSchemasResponseSchema>;
export type ListSchemasWhere = z.infer<typeof ListSchemasWhereSchema>;
