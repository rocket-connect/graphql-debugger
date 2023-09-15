import { createTestSchema } from "@graphql-debugger/data-access";
import { ListSchemasResponseSchema } from "@graphql-debugger/schemas";
import { ListSchemasResponse } from "@graphql-debugger/types";

import gql from "gql-tag";

import { request } from "../utils";

const query = gql`
  query {
    listSchemas {
      schemas {
        id
        hash
        name
        typeDefs
        createdAt
      }
    }
  }
`;

describe("queries/list-schemas", () => {
  test("should return a list of schemas", async () => {
    const createdSchema = await createTestSchema();

    const response = await request()
      .post("/graphql")
      .send({ query })
      .set("Accept", "application/json");

    const body = await response.body;

    const listSchemas = body.data?.listSchemas as ListSchemasResponse;

    expect(listSchemas.schemas).toEqual([
      {
        id: createdSchema.id,
        hash: createdSchema.hash,
        name: createdSchema.name,
        typeDefs: createdSchema.typeDefs,
        createdAt: expect.any(String),
      },
    ]);

    listSchemas.schemas[0].traceGroups = [];

    const parsed = ListSchemasResponseSchema.parse(listSchemas);

    expect(parsed).toEqual(listSchemas);
  });
});
