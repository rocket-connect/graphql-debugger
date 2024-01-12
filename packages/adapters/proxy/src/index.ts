import { BaseAdapter } from "@graphql-debugger/adapter-base";

import { ProxySchema } from "./entities/Schema";
import { ProxySpan } from "./entities/Span";
import { ProxyTrace } from "./entities/Trace";

export const adapterType = "proxy";

export interface ProxyAdapterOptions {
  apiURL: string;
  collectorURL: string;
}

export class ProxyAdapter extends BaseAdapter {
  public schema: ProxySchema;
  public span: ProxySpan;
  public trace: ProxyTrace;
  public options: ProxyAdapterOptions;

  constructor(options: ProxyAdapterOptions) {
    const schema = new ProxySchema(options);
    const span = new ProxySpan(options);
    const trace = new ProxyTrace(options);

    super({
      adapterType,
      schema,
      span,
      trace,
    });

    this.options = options;
    this.schema = schema;
    this.span = span;
    this.trace = trace;
  }

  public async clearDB(): Promise<boolean> {
    console.warn("clearDB not implemented for proxy adapter");
    return Promise.resolve(true);
  }
}
