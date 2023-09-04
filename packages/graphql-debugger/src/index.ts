#!/usr/bin/env node
process.env.DEBUG = process.env.DEBUG || `@graphql-debugger:*`;
import { debug } from './debug';

import * as backend from '@graphql-debugger/backend';

async function start() {
  try {
    debug('Starting debugger');

    const COLLECTOR_PORT = backend.COLLECTOR_PORT;
    const BACKEND_PORT = backend.BACKEND_PORT;

    await backend.start({
      collectorPort: COLLECTOR_PORT,
      backendPort: BACKEND_PORT,
    });

    debug(`Debugger Online http://localhost:${BACKEND_PORT}`);
  } catch (error) {
    debug('Failed to connect to start app', error);
    throw error;
  }
}

start();
