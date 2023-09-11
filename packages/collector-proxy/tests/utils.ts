import supertest from "supertest";
import { collector, postTracesQueue } from "../src/index";

export function request() {
  postTracesQueue
    .start()
    .then(() => {})
    .catch((e) => {
      console.log("Failed to start postTracesQueue");
      console.log(e);
    });

  return supertest(collector);
}
