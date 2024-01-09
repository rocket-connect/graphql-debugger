import util from "util";

import { DebuggerClient } from "../src/client";
import { simulateTrace } from "./utils/mocks";
import { prisma } from "./utils/prisma";

const sleep = util.promisify(setTimeout);

describe("DebuggerClient.trace", () => {
  describe("findMany", () => {
    test("should list trace groups", async () => {
      const client = new DebuggerClient();

      await simulateTrace();
      await sleep(2000); // wait for collector to injest the traces

      // TODO change to client
      // The first schema as we clearDB before each test
      const schema = await prisma.schema.findFirst({
        include: { traceGroups: true },
      });
      expect(schema).toBeDefined();

      const response = await client.trace.findMany({
        where: {
          schemaId: schema?.id as string,
          rootSpanName: "query posts",
        },
        includeSpans: true,
        includeRootSpan: true,
      });

      expect(response).toHaveLength(2);

      const [traceGroup1, traceGroup2] = response;
      expect(traceGroup1.spans).toHaveLength(2);
      expect(traceGroup2.spans).toHaveLength(2);
      expect(traceGroup1.rootSpan?.name).toEqual("query posts");
      expect(traceGroup2.rootSpan?.name).toEqual("query posts");
    });
  });
});
