import { clearDB } from "../../../data-access/build/index";
import * as backend from "./backend";

beforeAll(async () => {
  await backend.listen();
});

beforeEach(async () => {
  await clearDB();
});
afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await backend.close();
});
