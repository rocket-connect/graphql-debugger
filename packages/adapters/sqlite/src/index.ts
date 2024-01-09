import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { clearDB } from "@graphql-debugger/data-access";

import { SQLiteSchema } from "./entities/Schema";
import { SQLiteSpan } from "./entities/Span";
import { SQLiteTrace } from "./entities/Trace";

export const adapterType = "sqlite";

export class SQLiteAdapter extends BaseAdapter {
  public schema: SQLiteSchema;
  public span: SQLiteSpan;
  public trace: SQLiteTrace;

  constructor() {
    const schema = new SQLiteSchema();
    const span = new SQLiteSpan();
    const trace = new SQLiteTrace();

    super({
      adapterType,
      schema,
      span,
      trace,
    });

    this.schema = schema;
    this.span = span;
    this.trace = trace;
  }

  public async clearDB(): Promise<boolean> {
    await clearDB();

    return true;
  }
}
