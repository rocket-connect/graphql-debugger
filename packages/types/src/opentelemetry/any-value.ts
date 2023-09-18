import { AnyValueSchema, z } from "@graphql-debugger/schemas";

export type AnyValue = z.infer<typeof AnyValueSchema>;
