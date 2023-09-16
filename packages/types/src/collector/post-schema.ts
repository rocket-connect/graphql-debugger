import { PostSchemaSchema, z } from "@graphql-debugger/schemas";

export type PostSchema = z.infer<typeof PostSchemaSchema>;
