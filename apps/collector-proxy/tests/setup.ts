import { clearDB } from "@graphql-debugger/data-access";

beforeEach(async () => {
  await clearDB();
});
