import { StatusSchema, z } from "@graphql-debugger/schemas";

export type Status = z.infer<typeof StatusSchema>;
