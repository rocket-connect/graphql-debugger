#!/usr/bin/env node

import { debug } from './debug';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { app } from '@graphql-debugger/collector-proxy';

// const argv = yargs(hideBin(process.argv)).argv;

async function start() {
  try {
    debug('Starting debugger');

    const PORT = process.env.PORT || 16686;

    await app.listen(PORT);

    debug(`Debugger Online http://localhost:${PORT}`);
  } catch (error) {
    debug('Failed to connect to start app', error);
    throw error;
  }
}

start();
