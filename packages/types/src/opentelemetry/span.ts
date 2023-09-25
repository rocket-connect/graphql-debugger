import { OTELSpanSchema, z } from "@graphql-debugger/schemas";

export type OTELSpan = z.infer<typeof OTELSpanSchema>;
