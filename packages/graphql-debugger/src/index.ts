#!/usr/bin/env node

import { debug } from './debug';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { app } from '@graphql-debugger/collector-proxy';
const argv = yargs(hideBin(process.argv)).argv;

async function start() {
  try {
    debug('Starting app');
    await app.listen(4000);
    debug('Server Online');
  } catch (error) {
    debug('Failed to connect to start app', error);
    throw error;
  }
}

start();
