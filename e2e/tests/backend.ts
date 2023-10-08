import * as backend from "@graphql-debugger/backend";
import * as collector from "@graphql-debugger/collector-proxy";

import http from "http";

import { debug } from "../src/debug";

let backendServer: http.Server;
let collectorServer: http.Server;

let isListening = false;

export async function listen() {
  debug("Starting Collector Proxy");

  if (!isListening) {
    backendServer = await backend.start({ port: backend.BACKEND_PORT });
    collectorServer = await collector.start({ port: collector.COLLECTOR_PORT });

    isListening = true;
  }

  debug("Collector Proxy started");
}

export async function close() {
  debug("Closing Collector Proxy");

  if (isListening) {
    await backend.stop({ server: backendServer });
    await collector.stop({ server: collectorServer });
    isListening = false;
  }

  debug("Collector Proxy closed");
}
