import {
  ListSpansResponseSchema,
  ListSpansWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type ListSpansResponse = z.infer<typeof ListSpansResponseSchema>;
export type ListSpansWhere = z.infer<typeof ListSpansWhereSchema>;
