import { client } from "../src/client";

beforeEach(async () => {
  await client.adapter.clearDB();
});
