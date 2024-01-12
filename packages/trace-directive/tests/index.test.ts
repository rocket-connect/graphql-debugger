import * as pkg from "../src";

describe("graphql-otel", () => {
  test("should export traceDirective", () => {
    expect(pkg.traceDirective).toBeDefined();
  });

  test("should export GraphQLDebuggerContext", () => {
    expect(pkg.GraphQLDebuggerContext).toBeDefined();
  });
});
