import { attributesToObject } from "../src/attributes-to-object";

describe("attributesToObject", () => {
  test("should return an object with the attributes", () => {
    const document = /* GraphQL */ `
      {
        users {
          name
          age
          posts {
            title
            content
            comments {
              content
            }
          }
        }
      }
    `;

    const result = attributesToObject([
      {
        key: "graphql.operation.name",
        value: {
          stringValue: "users",
        },
      },
      {
        key: "graphql.operation.type",
        value: {
          stringValue: "query",
        },
      },
      {
        key: "graphql.document",
        value: {
          stringValue: document,
        },
      },
      {
        key: "graphql.operation.returnType",
        value: {
          stringValue: "[User]",
        },
      },
      {
        key: "boolValue",
        value: {
          boolValue: true,
        },
      },
      {
        key: "intValue",
        value: {
          intValue: 1,
        },
      },
      {
        key: "doubleValue",
        value: {
          doubleValue: 1.1,
        },
      },
      {
        key: "arrayValue",
        value: {
          arrayValue: {
            values: [
              {
                stringValue: "a",
              },
              {
                stringValue: "b",
              },
              {
                stringValue: "c",
              },
            ],
          },
        },
      },
    ]);

    expect(result).toEqual({
      "graphql.operation.name": "users",
      "graphql.operation.type": "query",
      "graphql.operation.returnType": "[User]",
      "graphql.document": document,
      boolValue: true,
      intValue: 1,
      doubleValue: 1.1,
      arrayValue: ["a", "b", "c"],
    });
  });
});
