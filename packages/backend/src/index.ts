import { prisma } from "@graphql-debugger/data-access";
import { queue } from "@graphql-debugger/collector-proxy";
import { debug } from "./debug";
import * as app from "./app";

import http from "http";

export async function start({
  backendPort,
  collectorPort,
}: {
  backendPort: string;
  collectorPort: string;
}) {
  try {
    debug("Starting application");

    await prisma.$connect();

    await queue.length();

    const { backend, collector } = await app.start({
      backendPort,
      collectorPort,
    });

    debug("Application started");

    return { backend, collector };
  } catch (error) {
    debug("Application failed to start", error);
    throw error;
  }
}

export async function stop({
  backend,
  collector,
}: {
  backend: http.Server;
  collector: http.Server;
}) {
  await backend.close();
  await collector.close();
}

export * from "./app";
export * from "./config";
