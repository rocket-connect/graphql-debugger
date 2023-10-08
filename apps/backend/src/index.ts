import http from "http";

import { app } from "./app";
import { debug } from "./debug";

export async function start({ port }: { port: string }) {
  try {
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

export * from "./app";
export * from "./config";
