import { SQLiteAdapter } from "@graphql-debugger/adapter-sqlite";
import { DebuggerClient } from "@graphql-debugger/client";

const adapter = new SQLiteAdapter();

export const client = new DebuggerClient({
  adapter,
});
