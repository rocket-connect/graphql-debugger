import { ListSchemasResponseSchema } from "@graphql-debugger/schemas";
import { ListSchemasResponse } from "@graphql-debugger/types";

import gql from "gql-tag";

import { client } from "../client";
import { request } from "../utils";
import { createTestSchema } from "../utils";

const query = gql`
  query ($where: ListSchemasWhere) {
    listSchemas(where: $where) {
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
    const { dbSchema } = await createTestSchema({
      client: client,
    });

    const response = await request()
      .post("/graphql")
      .send({ query })
      .set("Accept", "application/json");

    const body = await response.body;

    const listSchemas = body.data?.listSchemas as ListSchemasResponse;

    expect(listSchemas.schemas).toEqual([
      {
        id: dbSchema.id,
        hash: dbSchema.hash,
        name: dbSchema.name,
        typeDefs: dbSchema.typeDefs,
        createdAt: expect.any(String),
      },
    ]);

    listSchemas.schemas[0].traceGroups = [];

    const parsed = ListSchemasResponseSchema.parse(listSchemas);

    expect(parsed).toEqual(listSchemas);
  });

  test("should return a schema by id", async () => {
    const { dbSchema } = await createTestSchema({
      client,
    });
    await createTestSchema({
      client,
    }); // create another so we exclude it

    const response = await request()
      .post("/graphql")
      .send({ query, variables: { where: { id: dbSchema.id } } })
      .set("Accept", "application/json");

    const body = await response.body;

    const listSchemas = body.data?.listSchemas as ListSchemasResponse;

    expect(listSchemas.schemas).toEqual([
      {
        id: dbSchema.id,
        hash: dbSchema.hash,
        name: dbSchema.name,
        typeDefs: dbSchema.typeDefs,
        createdAt: expect.any(String),
      },
    ]);

    expect(listSchemas.schemas.length).toBe(1);

    listSchemas.schemas[0].traceGroups = [];

    const parsed = ListSchemasResponseSchema.parse(listSchemas);

    expect(parsed).toEqual(listSchemas);
  });
});
