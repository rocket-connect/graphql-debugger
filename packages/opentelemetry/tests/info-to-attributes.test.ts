import { AttributeNames } from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";

import { infoToAttributes } from "../src/info-to-attributes";

describe("infoToAttributes", () => {
  test("should turn info into attributes", async () => {
    const randomQuery = faker.string.alpha(6);
    const schemaHash = faker.string.alpha(6);
    const randomContextValue = faker.string.alpha(6);
    const randomArgValue = faker.string.alpha(6);

    const typeDefs = /* GraphQL */ `
      type Query {
        ${randomQuery}(value: String): String
      }
    `;

    const resolvers = {
      Query: {
        [randomQuery]: (_root, _args, _ctx, info) => {
          return JSON.stringify(
            infoToAttributes({
              info,
              schemaHash,
              context: { value: randomContextValue },
              args: _args,
              isRoot: true,
            }),
          );
        },
      },
    };

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const document = /* GraphQL */ `
      query ($value: String) {
        ${randomQuery}(value: $value)
      }
    `;

    const response = await graphql({
      schema,
      source: document,
      variableValues: {
        value: randomArgValue,
      },
    });

    expect(response.errors).toBeUndefined();

    const attributes = JSON.parse((response?.data as any)[randomQuery]);

    expect(attributes).toMatchObject({
      [AttributeNames.OPERATION_NAME]: randomQuery,
      [AttributeNames.OPERATION_TYPE]: "query",
      [AttributeNames.DOCUMENT]: expect.any(String),
      [AttributeNames.OPERATION_RETURN_TYPE]: "String",
      [AttributeNames.SCHEMA_HASH]: schemaHash,
      [AttributeNames.OPERATION_ARGS]: JSON.stringify({
        args: { value: randomArgValue },
      }),
      [AttributeNames.OPERATION_CONTEXT]: JSON.stringify({
        context: { value: randomContextValue },
      }),
    });
  });
});
