import { prisma } from '@graphql-debugger/data-access';
import { debug } from './debug';
import * as app from './app';
import { queue } from './collector/queue';

async function start() {
  try {
    debug('Starting application');

    await prisma.$connect();

    await queue.length();

    await app.start();

    debug('Application started');
  } catch (error) {
    debug('Application failed to start', error);
    throw error;
  }
}

start();
