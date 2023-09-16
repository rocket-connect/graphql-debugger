import { SchemaSchema, z } from "@graphql-debugger/schemas";

export type Schema = z.infer<typeof SchemaSchema>;
