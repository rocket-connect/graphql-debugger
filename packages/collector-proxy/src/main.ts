import { debug } from './debug';
import * as app from './app';

async function start() {
  try {
    debug('Starting application');

    await app.start();

    debug('Application started');
  } catch (error) {
    debug('Application failed to start', error);
    throw error;
  }
}

start();
