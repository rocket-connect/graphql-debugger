import { debug } from './debug';
import express, { Express } from 'express';
import * as config from './config';
import path from 'path';
import cors from 'cors';
import { yoga } from './graphql';
import { collector } from './collector/collector';
export { collector } from './collector/collector';

export const app: Express = express();
app.use(cors());
collector.use(cors());
app.use('/graphql', yoga);
app.use(express.static(path.join(__dirname, config.STATIC_FOLDER)));
app.use(express.static('public'));

export async function start() {
  try {
    debug('Starting app');

    const _app = await app.listen(config.UI_PORT);
    const _collector = await collector.listen(config.COLLECTOR_PORT);

    debug('GraphQL online on port: ', config.UI_PORT);
    debug('Collector online on port: ', config.COLLECTOR_PORT);

    return {
      app: _app,
      collector: _collector,
    };
  } catch (error) {
    debug('Failed to connect to start app', error);
    throw error;
  }
}
