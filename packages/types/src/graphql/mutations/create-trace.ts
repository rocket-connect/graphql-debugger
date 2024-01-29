import {
  CreateTraceInput,
  CreateTraceResponseSchema,
  z,
} from "@graphql-debugger/schemas";

export type CreateTraceInput = z.infer<typeof CreateTraceInput>;
export type CreateTraceResponse = z.infer<typeof CreateTraceResponseSchema>;
