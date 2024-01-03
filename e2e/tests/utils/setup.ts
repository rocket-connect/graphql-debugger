import { clearDB } from "@graphql-debugger/data-access";

import * as backend from "./backend";

const shouldSpawnBackend = process.env.E2E_IN_DOCKER !== "true";

beforeAll(async () => {
  if (shouldSpawnBackend) {
    await backend.listen();
  }
});

beforeEach(async () => {
  // TODO - for docker we might have to add an api to clear the db as this will point to the host machine
  await clearDB();
});

afterAll(async () => {
  if (shouldSpawnBackend) {
    await backend.close();
  }
});
