import * as backend from './backend';
import { clearDB } from './prisma';

beforeAll(async () => {
  await backend.listen();
});

beforeEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await backend.close();
});
