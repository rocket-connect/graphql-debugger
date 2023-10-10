import { hashSchema } from "@graphql-debugger/utils";

import { makeExecutableSchema } from "@graphql-tools/schema";

import { DebuggerClient } from "../src/client";
import { prisma } from "./utils/prisma";

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
      const respnse = await client.schema.createOne({
        data: { schema: typeDefs },
      });
      expect(respnse).toEqual(true);

      const schema = await prisma.schema.findFirst({
        where: { hash },
      });
      expect(schema).toBeDefined();
    });
  });
});
