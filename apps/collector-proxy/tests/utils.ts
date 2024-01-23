import supertest from "supertest";

import { app } from "../src/index";

export function request() {
  return supertest(app);
}
