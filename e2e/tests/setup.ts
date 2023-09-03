import * as collector from './collector';
import { clearDB } from './prisma';

beforeAll(async () => {
  await collector.listen();
});

beforeEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await collector.close();
});
