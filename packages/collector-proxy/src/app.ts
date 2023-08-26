import express, { Express } from 'express';
import * as config from './config';
// import * as graphql from './graphql';
import expressStaticGzip from 'express-static-gzip';
import path from 'path';
import { debug } from './debug';

export const app: Express = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, config.STATIC_FOLDER)));
app.use(express.static('public'));

export async function start() {
  try {
    debug('Starting app');

    await app.listen(config.HTTP_PORT);

    debug('Server Online ', config.HTTP_PORT);
  } catch (error) {
    debug('Failed to connect to start app', error);
    throw error;
  }
}
