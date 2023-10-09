import supertest from "supertest";

import {
  app,
  foreignTracesQueue,
  postSchemaQueue,
  postTracesQueue,
} from "../src/index";

export function request() {
  Promise.all([
    postTracesQueue.start(),
    postSchemaQueue.start(),
    foreignTracesQueue.start(),
  ])
    .then(() => {})
    .catch((e) => {
      console.log("Failed to start queues");
      console.log(e);
    });

  return supertest(app);
}
