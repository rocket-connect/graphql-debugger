import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { ClearDBResponse } from "@graphql-debugger/types";

import { ProxySchema } from "./entities/Schema";
import { ProxySpan } from "./entities/Span";
import { ProxyTrace } from "./entities/Trace";
import { executeGraphQLRequest } from "./utils";

export const adapterType = "proxy";

export interface ProxyAdapterOptions {
  apiURL?: string;
  collectorURL?: string;
}

export class ProxyAdapter extends BaseAdapter {
  public schema: ProxySchema;
  public span: ProxySpan;
  public trace: ProxyTrace;
  public apiURL: string;
  public collectorURL: string;

  constructor(options: ProxyAdapterOptions = {}) {
    const apiURL = options.apiURL || "http://localhost:16686";
    const collectorURL = options.collectorURL || "http://localhost:4318";

    const schema = new ProxySchema({
      apiURL,
      collectorURL,
    });

    const span = new ProxySpan({
      apiURL,
    });

    const trace = new ProxyTrace({
      apiURL,
    });

    super({
      adapterType,
      schema,
      span,
      trace,
    });

    this.apiURL = apiURL;
    this.collectorURL = collectorURL;
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
      url: this.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.clearDB.success;
  }
}
