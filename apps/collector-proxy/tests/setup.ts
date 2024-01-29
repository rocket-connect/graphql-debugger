import http from "http";

import { start } from "../src/index";
import { client } from "./client";

let server: http.Server;

beforeAll(async () => {
  const collector = await start({
    client,
  });

  server = collector.server as http.Server;
});

beforeEach(async () => {
  await client.adapter.clearDB();
});

afterAll(async () => {
  server?.close();
});
