import { ResourceSchema, z } from "@graphql-debugger/schemas";

export type Resource = z.infer<typeof ResourceSchema>;
