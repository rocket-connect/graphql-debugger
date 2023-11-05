import { ListTraceGroupsResponse } from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";
import "@testing-library/jest-dom";

import { isTraceError } from "../is-trace-error";

const traceId = faker.database.mongodbObjectId();
const spanId = faker.database.mongodbObjectId();

const trace: ListTraceGroupsResponse["traces"][0] = {
  id: faker.database.mongodbObjectId(),
  spans: [
    {
      createdAt: faker.date.recent().toISOString(),
      durationNano: faker.date.recent().toISOString(),
      endTimeUnixNano: faker.date.recent().toISOString(),
      id: faker.database.mongodbObjectId(),
      name: "test",
      isForeign: false,
      kind: "SERVER",
      spanId,
      startTimeUnixNano: faker.defaultRefDate().getTime().toString(),
      traceId,
      errorMessage: "span error message",
      errorStack: "span error stack",
      updatedAt: faker.date.recent().toISOString(),
    },
  ],
  traceId,
  firstSpanErrorMessage: "span error message",
  firstSpanErrorStack: "span error stack",
};

describe("checks if trace includes error", () => {
  it("should return true if trace includes error", () => {
    expect(isTraceError(trace)).toBe(true);
  });

  it("should return false if trace does not include error", () => {
    expect(
      isTraceError({
        ...trace,
        spans: [
          {
            ...trace.spans[0],
            errorMessage: "",
            errorStack: "",
          },
        ],
      }),
    ).toBe(false);
  });
});
