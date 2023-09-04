import supertest from "supertest";
import { collector } from "../src/collector/app";

export function request() {
  return supertest(collector);
}
