import { prisma } from "@graphql-debugger/data-access";
import { hashSchema } from "@graphql-debugger/utils";

import { faker } from "@faker-js/faker";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { describe, expect, test } from "@jest/globals";
import { parse, print } from "graphql";

import { request } from "./utils";

describe("POST /v1/schema", () => {
  test("should throw when no body is sent", async () => {
    const response = await request().post("/v1/schema").send({});

    expect(response.status).toBe(400);

    const body = await response.body;

    expect(body.message).toMatchSnapshot();
  });

  test("should throw an error when parsing the schema", async () => {
    const response = await request().post("/v1/schema").send({
      schema: "invalid schema",
    });

    expect(response.status).toBe(400);

    const body = await response.body;

    expect(body.message).toEqual("Could not parse schema");
  });

  test("shold return 200 when the schema is already stored", async () => {
    const schema = `
      type Query {
        name: String!
      }
    `;

    const executableSchema = makeExecutableSchema({
      typeDefs: schema,
      noLocation: true,
    });

    const hash = hashSchema(executableSchema);

    await prisma.schema.create({
      data: {
        hash,
        typeDefs: print(parse(schema)),
      },
    });

    const response = await request().post("/v1/schema").send({
      schema,
    });

    expect(response.status).toBe(200);
  });

  test("should store the schema", async () => {
    const schema = `
      type Query {
        ${faker.string.alpha({ length: 8 })}: String!
      }
    `;

    const response = await request().post("/v1/schema").send({
      schema,
    });

    expect(response.status).toBe(200);

    const hash = hashSchema(
      makeExecutableSchema({
        typeDefs: schema,
        noLocation: true,
      }),
    );

    const foundSchema = await prisma.schema.findFirst({
      where: {
        hash,
      },
    });

    expect(foundSchema).not.toBeNull();

    expect(foundSchema?.typeDefs).toEqual(print(parse(schema)));
  });
});
