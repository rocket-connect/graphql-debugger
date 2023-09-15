import {
  ListTraceGroupsResponseSchema,
  ListTraceGroupsWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type ListTraceGroupsResponse = z.infer<
  typeof ListTraceGroupsResponseSchema
>;
export type ListTraceGroupsWhere = z.infer<typeof ListTraceGroupsWhereSchema>;
