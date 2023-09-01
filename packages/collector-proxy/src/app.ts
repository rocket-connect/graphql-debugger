import { debug } from './debug';
import express, { Express } from 'express';
import * as config from './config';
import path from 'path';
import { collector } from './collector/collector';
import { yoga } from './graphql';

export const app: Express = express();
app.use('/graphql', yoga);
app.use(express.static(path.join(__dirname, config.STATIC_FOLDER)));
app.use(express.static('public'));

export async function start() {
  try {
    debug('Starting app');

    await app.listen(config.UI_PORT);
    await collector.listen(config.COLLECTOR_PORT);

    debug('Server Online port: ', config.UI_PORT);
    debug('Server Online port: ', config.COLLECTOR_PORT);

    return {
      collector: `http://localhost:${config.COLLECTOR_PORT}`,
      ui: `http://localhost:${config.UI_PORT}`,
    };
  } catch (error) {
    debug('Failed to connect to start app', error);
    throw error;
  }
}
