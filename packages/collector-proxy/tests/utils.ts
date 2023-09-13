import supertest from "supertest";

import { collector, postSchemaQueue, postTracesQueue } from "../src/index";

export function request() {
  Promise.all([postTracesQueue.start(), postSchemaQueue.start()])
    .then(() => {})
    .catch((e) => {
      console.log("Failed to start queues");
      console.log(e);
    });

  return supertest(collector);
}
