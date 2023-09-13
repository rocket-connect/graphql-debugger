import { z, PostTracesSchema } from "@graphql-debugger/schemas";

export type PostTraces = z.infer<typeof PostTracesSchema>;
