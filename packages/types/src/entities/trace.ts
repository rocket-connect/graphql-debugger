import { TraceSchema, z } from "@graphql-debugger/schemas";

export type Trace = z.infer<typeof TraceSchema>;
