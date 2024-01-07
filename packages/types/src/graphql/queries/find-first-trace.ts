import {
  FindFirstTraceResponseSchema,
  FindFirstTraceWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type FindFirstTraceResponse = z.infer<
  typeof FindFirstTraceResponseSchema
>;
export type FindFirstTraceWhere = z.infer<typeof FindFirstTraceWhereSchema>;
