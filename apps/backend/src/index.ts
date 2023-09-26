import {
  postSchemaQueue,
  postTracesQueue,
} from "@graphql-debugger/collector-proxy";
import { prisma } from "@graphql-debugger/data-access";

import http from "http";

import * as app from "./app";
import { debug } from "./debug";

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

    await postSchemaQueue.start();
    await postTracesQueue.start();

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