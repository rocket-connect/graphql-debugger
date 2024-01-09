import supertest from "supertest";

import { client } from "../src/client";
import { app, start } from "../src/index";

export function request() {
  Promise.all([
    start({
      client,
    }),
  ])
    .then(() => {})
    .catch((e) => {
      console.log("Failed to start queues");
      console.log(e);
    });

  return supertest(app);
}
