import { clearDB } from "../src/prisma";

beforeEach(async () => {
  await clearDB();
});
