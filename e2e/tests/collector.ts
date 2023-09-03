import { start } from '@graphql-debugger/collector-proxy';
export { app, collector } from '@graphql-debugger/collector-proxy';

export let isListening = false;

import http from 'http';
import { debug } from '../src/debug';

let app: http.Server;
let collector: http.Server;

export async function listen() {
  debug('Starting Collector Proxy');

  if (!isListening) {
    const started = await start();
    app = started.app;
    collector = started.collector;
    isListening = true;
  }

  debug('Collector Proxy started');

  return {
    app,
    collector,
  };
}

export async function close() {
  debug('Closing Collector Proxy');

  if (isListening) {
    await app.close();
    await collector.close();
    isListening = false;
  }

  debug('Collector Proxy closed');
}
