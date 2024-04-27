import type { Trace } from "@graphql-debugger/types";

import "@testing-library/jest-dom";

import { traceNameIncludes } from "../find-traces";

const trace: Trace = {
  id: "f7988314-ea0d-4001-a06e-f96b308089f9",
  traceId: "4e006c35894353043c3e63f64a1e17fe",
  rootSpan: {
    id: "d6f9f9a8-b33e-4593-8889-7374b8d89a9f",
    spanId: "a3a8cdab2334e195",
    traceId: "4e006c35894353043c3e63f64a1e17fe",
    parentSpanId: "11e8057c451324d4",
    name: "query listTraceGroups",
    kind: "1",
    isForeign: false,
    attributes: "",
    createdAt: "",
    updatedAt: "",
    errorMessage: null,
    errorStack: null,
    endTimeUnixNano: "1701211491536427904",
    startTimeUnixNano: "1701211491517032704",
    durationNano: "19395200",
    graphqlDocument:
      "query ($where: ListTraceGroupsWhere, $includeSpans: Boolean = false, $includeRootSpan: Boolean = false) {\n  listTraceGroups(where: $where) {\n    traces {\n      id\n      traceId\n      firstSpanErrorMessage\n      firstSpanErrorStack\n      spans @include(if: $includeSpans) {\n        ...SpanObject\n      }\n      rootSpan @include(if: $includeRootSpan) {\n        ...SpanObject\n      }\n    }\n  }\n}",
    graphqlOperationName: null,
    graphqlOperationType: "query",
  },
  spans: [],
};

describe("traceNameIncludes", () => {
  it("should return true if trace name includes search value", () => {
    const searchValue = "listTraceGroups";
    expect(traceNameIncludes(trace, searchValue)).toBe(true);
  });

  it("should return false if trace name does not include search value", () => {
    const searchValue = "aggregateSpans";
    expect(traceNameIncludes(trace, searchValue)).toBe(false);
  });
  it('should return true if we type "listtracegroups" and with spaces before and after name', () => {
    const searchValue = " listTraceGroups     ";
    expect(traceNameIncludes(trace, searchValue)).toBe(true);
  });

  it("should return false if we add space in the middle of the name", () => {
    const searchValue = "list TraceGroups";
    expect(traceNameIncludes(trace, searchValue)).toBe(false);
  });
});
