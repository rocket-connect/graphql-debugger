import util from "util";

import { DebuggerClient } from "../src/client";
import { simulateTrace } from "./utils/mocks";
import { prisma } from "./utils/prisma";

const sleep = util.promisify(setTimeout);

describe("DebuggerClient.span", () => {
  describe("aggregate", () => {
    test("should aggregate spans", async () => {
      const client = new DebuggerClient();

      await simulateTrace();
      await sleep(2000); // wait for collector to injest the traces

      // The first schema as we clearDB before each test
      const schema = await prisma.schema.findFirst({
        include: { traceGroups: true },
      });
      expect(schema).toBeDefined();

      const response = await client.span.aggregate({
        where: {
          name: "query posts",
          schemaId: schema?.id as string,
        },
      });

      expect(response.resolveCount).toEqual(2);
      expect(response.errorCount).toEqual(0);
      expect(response.averageDuration).toBeDefined();
      expect(response.lastResolved).toBeDefined();
    });
  });
});
