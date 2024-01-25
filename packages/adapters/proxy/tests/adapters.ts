import { SQLiteAdapter } from "@graphql-debugger/adapter-sqlite";

import { ProxyAdapter } from "../src";
import { BACKEND_PORT, COLLECTOR_PORT } from "./backend";

export const remoteAdapter = new ProxyAdapter({
  apiURL: `http://localhost:${BACKEND_PORT}`,
  collectorURL: `http://localhost:${COLLECTOR_PORT}`,
});

export const localAdapter = new SQLiteAdapter();
