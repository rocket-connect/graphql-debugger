#!/usr/bin/env node
import * as backend from "@graphql-debugger/backend";

import { debug } from "./debug";

process.env.DEBUG = process.env.DEBUG || `@graphql-debugger:*`;

async function start() {
  try {
    debug("Starting debugger");

    const COLLECTOR_PORT = backend.COLLECTOR_PORT;
    const BACKEND_PORT = backend.BACKEND_PORT;

    await backend.start({
      collectorPort: COLLECTOR_PORT,
      backendPort: BACKEND_PORT,
    });

    const message1 = `
      Thanks for downloading GraphQL Debugger!
      You can use GraphQL Debugger to debug your GraphQL server locally.
      Visit https://www.graphql-debugger.com for more info.
    `;
    console.log(message1);

    const message2 = `Debugger Online http://localhost:${BACKEND_PORT}`;
    console.log(message2);

    debug(`Debugger Online http://localhost:${BACKEND_PORT}`);
  } catch (error) {
    debug("Failed to connect to start app", error);
    throw error;
  }
}

start();
