import { SpanSchema, z } from "@graphql-debugger/schemas";

export type Span = z.infer<typeof SpanSchema>;
