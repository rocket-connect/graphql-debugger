import { client } from "../../src/client";
import * as backend from "./backend";

const shouldSpawnBackend = process.env.E2E_IN_DOCKER !== "true";

beforeAll(async () => {
  if (shouldSpawnBackend) {
    await backend.listen();
  }
});

beforeEach(async () => {
  await client.adapter.clearDB();
});

afterAll(async () => {
  if (shouldSpawnBackend) {
    await backend.close();
  }
});
