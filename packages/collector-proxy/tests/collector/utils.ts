import supertest from 'supertest';
import { collector } from '../../src/collector/collector';

export function request() {
  return supertest(collector);
}
