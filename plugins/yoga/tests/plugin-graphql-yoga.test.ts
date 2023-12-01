import { createYoga } from "../src";

describe("plugin-graphql-yoga", () => {
  test("should init the test's correctly", () => {
    expect(createYoga).toBeDefined();
  });
});
