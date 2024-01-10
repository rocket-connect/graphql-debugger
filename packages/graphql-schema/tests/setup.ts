import { start } from "@graphql-debugger/collector-proxy";

import { Server } from "http";

import { client } from "./client";

let server: Server | undefined = undefined;

beforeAll(async () => {
  if (!server) {
    const collectorInstance = await start({
      port: "4318",
      client,
    });

    server = collectorInstance.server as Server;
  }
});

beforeEach(async () => {
  await client.adapter.clearDB();
});

afterAll(async () => {
  await server?.close();
});
