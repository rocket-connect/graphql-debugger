import { request } from "./utils";
import { prisma } from "@graphql-debugger/data-access";
import { describe, beforeEach, test, expect } from "@jest/globals";
import { graphql, hashSchema } from "@graphql-debugger/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { faker } from "@faker-js/faker";

describe("POST /v1/schema", () => {
  beforeEach(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.schema.deleteMany();
    });
  });

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
        typeDefs: graphql.print(graphql.parse(schema)),
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

    expect(foundSchema?.typeDefs).toEqual(graphql.print(graphql.parse(schema)));
  });
});