import * as collector from "@graphql-debugger/collector-proxy";
import { createServer } from "@graphql-debugger/graphql-schema";

import express, { Express } from "express";
import http from "http";

import { localClient } from "./clients";

let backendServer: http.Server;
let collectorServer: http.Server;

let isListening = false;

export async function listen() {
  if (!isListening) {
    const backend: Express = express();
    backend.use(express.json());
    backend.use(
      "/graphql",
      createServer({
        client: localClient,
      }),
    );

    backendServer = await backend.listen(BACKEND_PORT);
    const collectorInstance = await collector.start({
      port: collector.COLLECTOR_PORT,
      client: localClient,
    });
    collectorServer = collectorInstance.server as http.Server;

    isListening = true;
  }
}

export async function close() {
  if (isListening) {
    await backendServer.close();
    await collector.stop({ server: collectorServer });
    isListening = false;
  }
}

export const BACKEND_PORT = 16686;
export const COLLECTOR_PORT = collector.COLLECTOR_PORT;
