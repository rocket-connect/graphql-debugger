import { DebuggerClient } from "../src/client";

describe("DebuggerClient", () => {
  test("should be defined", () => {
    const client = new DebuggerClient();

    expect(client).toBeDefined();
  });
});
