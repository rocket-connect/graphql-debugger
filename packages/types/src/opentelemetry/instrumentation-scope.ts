import { InstrumentationScopeSchema, z } from "@graphql-debugger/schemas";

export type InstrumentationScope = z.infer<typeof InstrumentationScopeSchema>;
