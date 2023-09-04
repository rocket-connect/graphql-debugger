#!/usr/bin/env node
process.env.DEBUG = process.env.DEBUG || `@graphql-debugger:*`;
import { debug } from './debug';

import * as backend from '@graphql-debugger/backend';

async function start() {
  try {
    debug('Starting debugger');

    const COLLECTOR_PORT = process.env.COLLECTOR_PORT || '4318';
    const BACKEND_PORT = process.env.BACKEND_PORT || '16686';

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
