import type { Span } from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";

import { isSpanError } from "../is-trace-error";

const span: Span = {
  createdAt: faker.date.recent().toISOString(),
  durationNano: faker.date.recent().toISOString(),
  endTimeUnixNano: faker.date.recent().toISOString(),
  id: faker.database.mongodbObjectId(),
  isForeign: false,
  kind: "SERVER",
  name: "test",
  spanId: faker.database.mongodbObjectId(),
  startTimeUnixNano: faker.defaultRefDate().getTime().toString(),
  traceId: faker.database.mongodbObjectId(),
  updatedAt: faker.date.recent().toISOString(),
  errorMessage: "span error message",
  errorStack: "span error stack",
};

describe("checks if span includes error", () => {
  it("should return true if span includes error", () => {
    expect(isSpanError(span)).toBe(true);
  });
  it("should return false if span does not include error", () => {
    expect(
      isSpanError({
        ...span,
        errorMessage: "",
        errorStack: "",
      }),
    ).toBe(false);
  });
});
