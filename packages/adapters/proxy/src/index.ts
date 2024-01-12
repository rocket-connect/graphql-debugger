import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ClearDBResponse } from "@graphql-debugger/types";

import { ProxySchema } from "./entities/Schema";
import { ProxySpan } from "./entities/Span";
import { ProxyTrace } from "./entities/Trace";
import { executeGraphQLRequest } from "./utils";

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
    const query = /* GraphQL */ `
      mutation ClearDB {
        clearDB {
          success
        }
      }
    `;

    const { data, errors } = await executeGraphQLRequest<{
      clearDB: ClearDBResponse;
    }>({
      query,
      url: this.options.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.clearDB.success;
  }
}
