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
  schema: GraphQLSchema;
  schemaHash?: string;
}

export class GraphQLDebuggerContext {
  private context?: Context;
  public tracer: Tracer;
  private rootSpan?: ApiSpan;
  public schema: GraphQLSchema;
  public schemaHash: string;

  constructor(options: GraphQLDebuggerContextOptions) {
    this.schema = options.schema;
    this.schemaHash = options.schemaHash || hashSchema(options.schema);
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
