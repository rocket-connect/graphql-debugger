import { BaseSchema } from "./entities/Schema";
import { BaseSpan } from "./entities/Span";
import { BaseTrace } from "./entities/Trace";

export abstract class BaseAdapter {
  public adapterType: string;
  public schema: BaseSchema;
  public span: BaseSpan;
  public trace: BaseTrace;

  constructor({
    schema,
    span,
    trace,
    adapterType,
  }: {
    schema: BaseSchema;
    span: BaseSpan;
    trace: BaseTrace;
    adapterType: string;
  }) {
    this.schema = schema;
    this.span = span;
    this.trace = trace;
    this.adapterType = adapterType;
  }

  // TODO - this should be removed or restricted to testing only
  public abstract clearDB(): Promise<boolean>;
}

export { BaseSchema, BaseSpan, BaseTrace };
