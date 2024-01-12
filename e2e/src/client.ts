import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import { SQLiteAdapter } from "@graphql-debugger/adapter-sqlite";
import { DebuggerClient } from "@graphql-debugger/client";

const ADAPTER_TYPE: string = process.env.ADAPTER_TYPE ?? "sqlite";

let adapter: BaseAdapter;

switch (ADAPTER_TYPE) {
  case "sqlite":
    adapter = new SQLiteAdapter();
    break;

  case "proxy":
    adapter = new ProxyAdapter({
      apiURL: "http://localhost:16686",
      collectorURL: "http://localhost:4318",
    });
    break;
  default:
    throw new Error(`Unknown adapter type: ${ADAPTER_TYPE}`);
}

export const client = new DebuggerClient({
  adapter,
});
