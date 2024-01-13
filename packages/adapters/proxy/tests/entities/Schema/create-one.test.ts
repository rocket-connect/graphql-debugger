import { makeExecutableSchema } from "@graphql-tools/schema";
import { parse, print } from "graphql";

import { hashSchema } from "../../../../../utils/build";
import { localAdapter, remoteAdapter } from "../../adapters";

describe("Schema", () => {
  describe("createOne", () => {
    test("should return true and do nothing if schema already exists", async () => {
      const typeDefs = `
        type Query {
          name: String!
        }
      `;

      const executableSchema = makeExecutableSchema({
        typeDefs,
        noLocation: true,
      });

      const hash = hashSchema(executableSchema);
      const schemaString = print(parse(typeDefs));

      await localAdapter.schema.createOne({
        data: {
          hash,
          schema: schemaString,
        },
      });

      const result = await remoteAdapter.schema.createOne({
        data: {
          hash,
          schema: schemaString,
        },
      });

      expect(result).toEqual(true);
    });

    test("should create a schema and return true", async () => {
      const typeDefs = `
        type Query {
          name: String!
        }
      `;

      const executableSchema = makeExecutableSchema({
        typeDefs,
        noLocation: true,
      });

      const hash = hashSchema(executableSchema);
      const schemaString = print(parse(typeDefs));

      const result = await remoteAdapter.schema.createOne({
        data: {
          hash,
          schema: schemaString,
        },
      });

      expect(result).toEqual(true);

      const foundSchema = await localAdapter.schema.findFirst({
        where: {
          hash,
        },
      });

      expect(foundSchema?.hash).toEqual(hash);
    });
  });
});
