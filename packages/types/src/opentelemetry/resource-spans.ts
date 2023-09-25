import { ResourceSpansSchema, z } from "@graphql-debugger/schemas";

export type ResourceSpans = z.infer<typeof ResourceSpansSchema>;
