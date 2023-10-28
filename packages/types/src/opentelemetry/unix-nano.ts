import { UnixNanoSchema, z } from "@graphql-debugger/schemas";

export type UnixNano = z.infer<typeof UnixNanoSchema>;
