import {
  collector,
  postSchemaQueue,
  postTracesQueue,
} from "@graphql-debugger/collector-proxy";
import { clearDB } from "@graphql-debugger/data-access";

import { Server } from "http";

let server: Server;

beforeAll(async () => {
  await postTracesQueue.start();
  await postSchemaQueue.start();
  server = await collector.listen(4318);
});

beforeEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await server.close();
});
