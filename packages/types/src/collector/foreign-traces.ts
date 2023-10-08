import { ForeignTracesSchema, z } from "@graphql-debugger/schemas";

export type ForeignTraces = z.infer<typeof ForeignTracesSchema>;
