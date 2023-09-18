import { EventSchema, z } from "@graphql-debugger/schemas";

export type Event = z.infer<typeof EventSchema>;
