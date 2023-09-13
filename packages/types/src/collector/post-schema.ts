import { z, PostSchemaSchema } from "@graphql-debugger/schemas";

export type PostSchema = z.infer<typeof PostSchemaSchema>;
