import { ExtractedSpanSchema, z } from "@graphql-debugger/schemas";

export type ExtractedSpan = z.infer<typeof ExtractedSpanSchema>;
