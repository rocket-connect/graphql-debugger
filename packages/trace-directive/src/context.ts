import {
  ApiSpan,
  Context,
  Tracer,
  context,
  getTracer,
  runInSpan,
} from "@graphql-debugger/opentelemetry";
import { hashSchema } from "@graphql-debugger/utils";

import { GraphQLSchema } from "graphql";

export interface GraphQLDebuggerContextOptions {
  /* If true will add the context in the span attributes */
  includeContext?: boolean;
  /* If true will add the variables in the span attributes */
  includeVariables?: boolean;
  /* If true will add the result in the span attributes */
  includeResult?: boolean;
  /* List of strings to exclude from the context, for example auth */
  excludeKeysFromContext?: string[];
}

export class GraphQLDebuggerContext {
  private context?: Context;
  public tracer: Tracer;
  private rootSpan?: ApiSpan;
  public includeContext?: boolean;
  public includeVariables?: boolean;
  public includeResult?: boolean;
  public excludeKeysFromContext?: string[];
  public schema?: GraphQLSchema;
  public schemaHash?: string;

  constructor(options: GraphQLDebuggerContextOptions = {}) {
    this.includeContext = options.includeContext;
    this.includeVariables = options.includeVariables;
    this.excludeKeysFromContext = options.excludeKeysFromContext;
    this.includeResult = options.includeResult;
    this.tracer = getTracer();
  }

  setContext(ctx: Context) {
    this.context = ctx;
  }

  getContext(): Context | undefined {
    return this.context;
  }

  setRootSpan(span: ApiSpan) {
    this.rootSpan = span;
  }

  getRootSpan(): ApiSpan | undefined {
    return this.rootSpan;
  }

  public setSchema(schema: GraphQLSchema) {
    const hash = hashSchema(schema);

    this.schemaHash = hash;
    this.schema = schema;
  }

  runInChildSpan(input: {
    name: string;
    cb: () => unknown;
    graphqlContext: any;
  }): unknown {
    const internalCtx = input.graphqlContext
      .GraphQLDebuggerContext as GraphQLDebuggerContext;

    if (!internalCtx) {
      throw new Error("contextValue.GraphQLDebuggerContext missing");
    }

    const parentContext = internalCtx ? internalCtx.getContext() : undefined;

    const traceCTX: Context = parentContext || context.active();
    internalCtx.setContext(traceCTX);

    const currentSpan = input.graphqlContext.currentSpan as ApiSpan | undefined;

    return runInSpan(
      {
        name: input.name,
        context: traceCTX,
        tracer: internalCtx.tracer,
        parentSpan: currentSpan,
      },
      input.cb,
    );
  }
}
