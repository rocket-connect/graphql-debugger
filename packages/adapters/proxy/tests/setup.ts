import { localAdapter } from "./adapters";
import * as backend from "./backend";
import { localClient } from "./clients";

beforeEach(async () => {
  await localAdapter.clearDB();
});

beforeAll(async () => {
  await backend.listen();
});

beforeEach(async () => {
  await localClient.adapter.clearDB();
});

afterAll(async () => {
  await backend.close();
});
