import express from "express";
import supertest from "supertest";

import { yoga } from "../src";

const app = express();

app.post("/graphql", yoga);

export function request() {
  return supertest(app);
}
