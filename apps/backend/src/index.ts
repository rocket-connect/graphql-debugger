import { DebuggerClient } from "@graphql-debugger/client";
import { createServer } from "@graphql-debugger/graphql-schema";
import { graphqlDebugger } from "@graphql-debugger/plugin-express";

import cors from "cors";
import express, { Express } from "express";
import expressStaticGzip from "express-static-gzip";
import http from "http";
import path from "path";

import { TRACE_EXPRESS } from "./config";
import { debug } from "./debug";

export async function start({
  port,
  client,
}: {
  port: string;
  client: DebuggerClient;
}) {
  try {
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    if (TRACE_EXPRESS) {
      app.use(graphqlDebugger());
    }
    app.use(
      "/graphql",
      createServer({
        client,
      }),
    );
    app.use(
      "/",
      expressStaticGzip(path.join(__dirname, "../../ui/build"), {
        enableBrotli: true,
      }),
    );
    app.use(express.static("public"));

    const server = await app.listen(port);

    debug("Application started");

    return server;
  } catch (error) {
    debug("Application failed to start", error);
    throw error;
  }
}

export async function stop({ server }: { server: http.Server }) {
  await server.close();
}

export * from "./config";
