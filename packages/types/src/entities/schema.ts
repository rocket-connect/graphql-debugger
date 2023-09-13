import { z, SchemaSchema } from "@graphql-debugger/schemas";

export type Schema = z.infer<typeof SchemaSchema>;
