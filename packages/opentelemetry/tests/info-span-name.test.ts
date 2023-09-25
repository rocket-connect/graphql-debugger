import { faker } from "@faker-js/faker";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";

import { infoToSpanName } from "../src/info-to-span-name";

describe("infoToSpanName", () => {
  test("should turn query info into a span name", async () => {
    const randomQuery = faker.string.alpha(6);

    const typeDefs = /* GraphQL */ `
      type Query {
        ${randomQuery}: String
      }
    `;

    const resolvers = {
      Query: {
        [randomQuery]: (_root, _args, _ctx, info) => {
          return infoToSpanName({ info });
        },
      },
    };

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const document = /* GraphQL */ `
      {
        ${randomQuery}
      }
    `;

    const response = await graphql({
      schema,
      source: document,
    });

    expect(response.errors).toBeUndefined();

    expect(response.data).toEqual({
      [randomQuery]: `query ${randomQuery}`,
    });
  });

  test("should turn field info into a span name", async () => {
    const randomQuery = faker.string.alpha(6);
    const randomType = faker.string.alpha(6);
    const randomField = faker.string.alpha(6);

    const typeDefs = /* GraphQL */ `
        type ${randomType} {
            ${randomField}: String
        }

        type Query {
            ${randomQuery}: ${randomType}
        }
    `;

    const resolvers = {
      Query: {
        [randomQuery]: () => {
          return {
            [randomField]: "", // this will be generated in the field resolver
          };
        },
      },
      [randomType]: {
        [randomField]: (_root, _args, _ctx, info) => {
          return infoToSpanName({ info });
        },
      },
    };

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const document = /* GraphQL */ `
      {
        ${randomQuery} {
            ${randomField}
        }
      }
    `;

    const response = await graphql({
      schema,
      source: document,
    });

    expect(response.errors).toBeUndefined();

    expect(response.data).toEqual({
      [randomQuery]: {
        [randomField]: `${randomType} ${randomField}`,
      },
    });
  });
});
