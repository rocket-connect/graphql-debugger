import {
  CreateSpanInput,
  CreateSpanResponseSchema,
  z,
} from "@graphql-debugger/schemas";

export type CreateSpanInput = z.infer<typeof CreateSpanInput>;
export type CreateSpanResponse = z.infer<typeof CreateSpanResponseSchema>;
