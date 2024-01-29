import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { SQLiteAdapter } from "@graphql-debugger/adapter-sqlite";

import { ClientOptions } from "./types";

export const DEFAULT_BACKEND_URL = "http://localhost:16686";
export const DEFAULT_COLLECTOR_URL = "http://localhost:4318";

export class DebuggerClient {
  public adapter: BaseAdapter;

  constructor(clientOptions: ClientOptions = {}) {
    const adapter = clientOptions.adapter || new SQLiteAdapter();
    this.adapter = adapter;
  }

  get schema() {
    return this.adapter.schema;
  }

  get trace() {
    return this.adapter.trace;
  }

  get span() {
    return this.adapter.span;
  }
}
