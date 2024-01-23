import { localAdapter } from "./adapters";
import * as backend from "./backend";

beforeEach(async () => {
  await localAdapter.clearDB();
});

beforeAll(async () => {
  await backend.listen();
});

afterAll(async () => {
  await backend.close();
});
