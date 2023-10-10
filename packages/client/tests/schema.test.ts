import { hashSchema } from "@graphql-debugger/utils";

import { makeExecutableSchema } from "@graphql-tools/schema";
import util from "util";

import { DebuggerClient } from "../src/client";
import { prisma } from "./utils/prisma";

const sleep = util.promisify(setTimeout);

describe("DebuggerClient.schema", () => {
  describe("createOne", () => {
    test("should create a schema", async () => {
      const client = new DebuggerClient();

      const typeDefs = /* GraphQL */ `
        type Query {
          hello: String
        }
      `;

      const exeSchema = makeExecutableSchema({
        typeDefs,
      });

      const hash = hashSchema(exeSchema);
      const response = await client.schema.createOne({
        data: { schema: typeDefs },
      });
      expect(response).toEqual(true);
      await sleep(1000); // wait for collector to ingest

      const schema = await prisma.schema.findFirst({
        where: { hash },
      });
      expect(schema).toBeDefined();
    });
  });
});
