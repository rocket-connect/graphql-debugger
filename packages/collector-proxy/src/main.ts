import { debug } from './debug';
import * as app from './app';
import { prisma } from './prisma';

async function start() {
  try {
    debug('Starting application');

    await prisma.$connect();

    await prisma.span.deleteMany({});
    await prisma.traceGroup.deleteMany({});
    await prisma.schema.deleteMany({});

    await app.start();

    debug('Application started');
  } catch (error) {
    debug('Application failed to start', error);
    throw error;
  }
}

start();
