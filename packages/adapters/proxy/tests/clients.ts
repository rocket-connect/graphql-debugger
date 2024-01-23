import { DebuggerClient } from "@graphql-debugger/client";

import { localAdapter, remoteAdapter } from "./adapters";

export const remoteClient = new DebuggerClient({
  adapter: remoteAdapter,
});

export const localClient = new DebuggerClient({
  adapter: localAdapter,
});
