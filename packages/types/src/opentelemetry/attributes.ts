import { AttributesSchema, z } from "@graphql-debugger/schemas";

export type Attributes = z.infer<typeof AttributesSchema>;
