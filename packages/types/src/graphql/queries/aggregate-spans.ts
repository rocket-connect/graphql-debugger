import {
  AggregateSpansResponseSchema,
  AggregateSpansWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type AggregateSpansResponse = z.infer<
  typeof AggregateSpansResponseSchema
>;
export type AggregateSpansWhere = z.infer<typeof AggregateSpansWhereSchema>;
