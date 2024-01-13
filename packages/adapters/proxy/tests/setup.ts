import { localAdapter } from "./adapters";

beforeEach(async () => {
  await localAdapter.clearDB();
});
