import { start, stop } from '@graphql-debugger/backend';
import http from 'http';
import { debug } from '../src/debug';

let server: {
  backend: http.Server;
  collector: http.Server;
};

let isListening = false;

export async function listen() {
  debug('Starting Collector Proxy');

  if (!isListening) {
    server = await start({
      backendPort: '16686',
      collectorPort: '4318',
    });

    isListening = true;
  }

  debug('Collector Proxy started');

  return server;
}

export async function close() {
  debug('Closing Collector Proxy');

  if (isListening) {
    await stop(server);
    isListening = false;
  }

  debug('Collector Proxy closed');
}
