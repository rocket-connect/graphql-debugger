import http from "http";

// These imports are like this to stop a circular dependency
// This is only for testing purposes
import * as backend from "../../../../apps/backend/build";
import * as collector from "../../../../apps/collector-proxy/build";

let backendServer: http.Server;
let collectorServer: http.Server;

let isListening = false;

export async function listen() {
  if (!isListening) {
    backendServer = await backend.start({ port: backend.BACKEND_PORT });
    collectorServer = await collector.start({ port: collector.COLLECTOR_PORT });

    isListening = true;
  }
}

export async function close() {
  if (isListening) {
    await backend.stop({ server: backendServer });
    await collector.stop({ server: collectorServer });
    isListening = false;
  }
}
