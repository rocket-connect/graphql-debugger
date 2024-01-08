import {
  UpdateTraceInput,
  UpdateTraceResponseSchema,
  UpdateTraceWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type UpdateTraceInput = z.infer<typeof UpdateTraceInput>;
export type UpdateTraceWhere = z.infer<typeof UpdateTraceWhereSchema>;
export type UpdateTraceResponse = z.infer<typeof UpdateTraceResponseSchema>;
