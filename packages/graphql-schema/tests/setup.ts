import {
  app as collector,
  postSchemaQueue,
  postTracesQueue,
} from "@graphql-debugger/collector-proxy";

import { Server } from "http";

import { client } from "./client";

let server: Server;

beforeAll(async () => {
  await postTracesQueue.start();
  await postSchemaQueue.start();
  server = await collector.listen(4318);
});

beforeEach(async () => {
  await client.adapter.clearDB();
});

afterAll(async () => {
  await server.close();
});
