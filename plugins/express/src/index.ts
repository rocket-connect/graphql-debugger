import { context, getTracer, runInSpan } from "@graphql-debugger/opentelemetry";

import { NextFunction, Request, Response } from "express";

import { HttpServerAttributeNames } from "./attributes";

export interface GraphQLDebuggerExpressOptions {
  /** The path to trace. Defaults to "/graphql". */
  path?: string;
  method?: string;
}

export function graphqlDebugger({
  path = "/graphql",
  method = "POST",
}: GraphQLDebuggerExpressOptions = {}) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (req.path === path && req.method === method && req.body) {
      await runInSpan(
        {
          name: `HTTP ${req.method} ${req.path}`,
          tracer: getTracer(),
          context: context.active(),
        },
        async (span) => {
          const attributes = {
            [HttpServerAttributeNames.HTTP_ROUTE]: req.path,
            [HttpServerAttributeNames.CLIENT_ADDRESS]: req.ip,
            [HttpServerAttributeNames.CLIENT_PORT]: req.socket.remotePort,
            [HttpServerAttributeNames.CLIENT_SOCKET_ADDRESS]:
              req.socket.remoteAddress,
            [HttpServerAttributeNames.CLIENT_SOCKET_PORT]:
              req.socket.remotePort?.toString(),
            [HttpServerAttributeNames.SERVER_PORT]:
              req.socket.localPort?.toString(),
            [HttpServerAttributeNames.SERVER_ADDRESS]: req.hostname,
            [HttpServerAttributeNames.SERVER_SOCKET_ADDRESS]:
              req.socket.localAddress,
            [HttpServerAttributeNames.URL_PATH]: req.path,
            [HttpServerAttributeNames.URL_QUERY]: JSON.stringify(req.query),
          };

          Object.entries(attributes).forEach(([key, value]) => {
            if (value) {
              span.setAttribute(key, value);
            }
          });

          try {
            await next();
          } finally {
            span.end();
          }
        },
      );
    } else {
      await next();
    }
  };
}
