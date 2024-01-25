import { ClearDBResponseSchema, z } from "@graphql-debugger/schemas";

export type ClearDBResponse = z.infer<typeof ClearDBResponseSchema>;
