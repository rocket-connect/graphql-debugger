import { ScopeSpansSchema, z } from "@graphql-debugger/schemas";

export type ScopeSpans = z.infer<typeof ScopeSpansSchema>;
