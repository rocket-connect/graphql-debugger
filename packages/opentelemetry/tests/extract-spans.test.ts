import { AttributeNames, ResourceSpans } from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";
import { parse, print } from "graphql";

import { extractSpans } from "../src/extract-spans";
import { TRACER_NAME, TRACER_VERSION } from "../src/tracer";

describe("extractSpans", () => {
  test("should extract data from spans", () => {
    const schemaHash = faker.string.alpha(6);

    const document = print(
      parse(/* GraphQL */ `
        {
          users(where: { name: "bob" }) {
            name
            errorField
          }
        }
      `),
    );

    const variables = JSON.stringify({
      where: {
        name: "bob",
      },
    });

    const context = JSON.stringify({
      user: {
        id: "1",
      },
    });

    const result = JSON.stringify({
      users: [
        {
          name: "bob",
        },
      ],
    });

    const error = new Error("something went wrong");

    const knownScope: ResourceSpans["scopeSpans"][0]["scope"] = {
      name: TRACER_NAME,
      version: TRACER_VERSION,
    };

    const resourceSpans: ResourceSpans[] = [
      {
        scopeSpans: [
          {
            scope: knownScope,
            spans: [
              {
                spanId: "1",
                traceId: "1",
                parentSpanId: undefined,
                name: "query users",
                kind: 0,
                attributes: [
                  {
                    key: AttributeNames.OPERATION_NAME,
                    value: {
                      stringValue: "users",
                    },
                  },
                  {
                    key: AttributeNames.OPERATION_TYPE,
                    value: {
                      stringValue: "query",
                    },
                  },
                  {
                    key: AttributeNames.DOCUMENT,
                    value: {
                      stringValue: document,
                    },
                  },
                  {
                    key: AttributeNames.SCHEMA_HASH,
                    value: {
                      stringValue: schemaHash,
                    },
                  },
                  {
                    key: AttributeNames.OPERATION_RETURN_TYPE,
                    value: {
                      stringValue: "[User]",
                    },
                  },
                  {
                    key: AttributeNames.OPERATION_ARGS,
                    value: {
                      stringValue: variables,
                    },
                  },
                  {
                    key: AttributeNames.OPERATION_CONTEXT,
                    value: {
                      stringValue: context,
                    },
                  },
                  {
                    key: AttributeNames.OPERATION_RESULT,
                    value: {
                      stringValue: result,
                    },
                  },
                ],
                droppedAttributesCount: 0,
                startTimeUnixNano: 1,
                endTimeUnixNano: 1,
                droppedEventsCount: 0,
                droppedLinksCount: 0,
                events: [],
                links: [],
                status: {
                  code: 0,
                },
              },
              {
                spanId: "2",
                traceId: "2",
                parentSpanId: "1",
                name: "User name",
                kind: 0,
                attributes: [
                  {
                    key: AttributeNames.SCHEMA_HASH,
                    value: {
                      stringValue: schemaHash,
                    },
                  },
                ],
                droppedAttributesCount: 0,
                startTimeUnixNano: 2,
                endTimeUnixNano: 2,
                droppedEventsCount: 0,
                droppedLinksCount: 0,
                events: [],
                links: [],
                status: {
                  code: 0,
                },
              },
              {
                spanId: "3",
                traceId: "3",
                parentSpanId: "1",
                name: "User errorField",
                kind: 0,
                attributes: [
                  {
                    key: AttributeNames.SCHEMA_HASH,
                    value: {
                      stringValue: schemaHash,
                    },
                  },
                ],
                droppedAttributesCount: 0,
                startTimeUnixNano: 3,
                endTimeUnixNano: 3,
                droppedEventsCount: 0,
                droppedLinksCount: 0,
                events: [
                  {
                    name: "exception",
                    timeUnixNano: 3,
                    droppedAttributesCount: 0,
                    attributes: [
                      {
                        key: "exception.message",
                        value: {
                          stringValue: error.message,
                        },
                      },
                    ],
                  },
                ],
                links: [],
                status: {
                  code: 0,
                },
              },
            ],
          },
        ],
      },
    ];

    const spans = extractSpans({ resourceSpans });

    expect(spans).toEqual([
      {
        spanId: "1",
        traceId: "1",
        parentSpanId: undefined,
        name: "query users",
        kind: 0,
        startTimeUnixNano: 1,
        endTimeUnixNano: 1,
        graphqlSchemaHash: schemaHash,
        graphqlDocument: document,
        graphqlVariables: variables,
        graphqlResult: result,
        graphqlContext: context,
        errorMessage: undefined,
        errorStack: undefined,
        isForeign: false,
      },
      {
        spanId: "2",
        traceId: "2",
        parentSpanId: "1",
        name: "User name",
        kind: 0,
        startTimeUnixNano: 2,
        endTimeUnixNano: 2,
        graphqlSchemaHash: schemaHash,
        graphqlDocument: undefined,
        graphqlVariables: undefined,
        graphqlResult: undefined,
        graphqlContext: undefined,
        errorMessage: undefined,
        errorStack: undefined,
        isForeign: false,
      },
      {
        spanId: "3",
        traceId: "3",
        parentSpanId: "1",
        name: "User errorField",
        kind: 0,
        startTimeUnixNano: 3,
        endTimeUnixNano: 3,
        graphqlSchemaHash: schemaHash,
        graphqlDocument: undefined,
        graphqlVariables: undefined,
        graphqlResult: undefined,
        graphqlContext: undefined,
        errorMessage: error.message,
        errorStack: undefined,
        isForeign: false,
      },
    ]);
  });

  test("should extract data from foreign spans", () => {
    const schemaHash = faker.string.alpha(6);

    const document = print(
      parse(/* GraphQL */ `
        {
          users {
            name
          }
        }
      `),
    );

    const knownScope: ResourceSpans["scopeSpans"][0]["scope"] = {
      name: TRACER_NAME,
      version: TRACER_VERSION,
    };

    const foreignScope: ResourceSpans["scopeSpans"][0]["scope"] = {
      name: "prisma",
    };

    const resourceSpans: ResourceSpans[] = [
      {
        scopeSpans: [
          {
            scope: knownScope,
            spans: [
              {
                spanId: "1",
                traceId: "1",
                parentSpanId: undefined,
                name: "query users",
                kind: 0,
                attributes: [
                  {
                    key: AttributeNames.OPERATION_NAME,
                    value: {
                      stringValue: "users",
                    },
                  },
                  {
                    key: AttributeNames.OPERATION_TYPE,
                    value: {
                      stringValue: "query",
                    },
                  },
                  {
                    key: AttributeNames.DOCUMENT,
                    value: {
                      stringValue: document,
                    },
                  },
                  {
                    key: AttributeNames.SCHEMA_HASH,
                    value: {
                      stringValue: schemaHash,
                    },
                  },
                  {
                    key: AttributeNames.OPERATION_RETURN_TYPE,
                    value: {
                      stringValue: "[User]",
                    },
                  },
                ],
                startTimeUnixNano: 1,
                endTimeUnixNano: 2,
                status: {
                  code: 0,
                },
              },
              {
                spanId: "4",
                traceId: "1",
                parentSpanId: "1",
                name: "User name",
                kind: 0,
                attributes: [
                  {
                    key: AttributeNames.SCHEMA_HASH,
                    value: {
                      stringValue: schemaHash,
                    },
                  },
                ],
                startTimeUnixNano: 3,
                endTimeUnixNano: 3,
                status: {
                  code: 0,
                },
              },
            ],
          },
          {
            scope: foreignScope,
            spans: [
              {
                spanId: "2",
                traceId: "1",
                parentSpanId: "1",
                name: "prisma:client:operation",
                kind: 1,
                startTimeUnixNano: 3,
                endTimeUnixNano: 4,
                attributes: [
                  {
                    key: "method",
                    value: {
                      stringValue: "findMany",
                    },
                  },
                  {
                    key: "model",
                    value: {
                      stringValue: "User",
                    },
                  },
                  {
                    key: "name",
                    value: {
                      stringValue: "User.findMany",
                    },
                  },
                ],
                status: {
                  code: 0,
                },
              },
              {
                spanId: "3",
                traceId: "1",
                parentSpanId: "2",
                name: "prisma:engine:db_query",
                kind: 1,
                startTimeUnixNano: 5,
                endTimeUnixNano: 6,
                attributes: [
                  {
                    key: "db.statement",
                    value: {
                      stringValue: "SELECT * FROM User",
                    },
                  },
                ],
                status: {
                  code: 0,
                },
              },
            ],
          },
        ],
      },
    ];

    const spans = extractSpans({ resourceSpans });

    expect(spans).toEqual([
      {
        spanId: "1",
        traceId: "1",
        name: "query users",
        kind: 0,
        startTimeUnixNano: 1,
        endTimeUnixNano: 2,
        isForeign: false,
        graphqlSchemaHash: schemaHash,
        graphqlDocument: "{\n  users {\n    name\n  }\n}",
        parentSpanId: undefined,
        errorMessage: undefined,
        errorStack: undefined,
        graphqlContext: undefined,
        graphqlResult: undefined,
        graphqlVariables: undefined,
      },
      {
        spanId: "4",
        traceId: "1",
        parentSpanId: "1",
        name: "User name",
        kind: 0,
        startTimeUnixNano: 3,
        endTimeUnixNano: 3,
        isForeign: false,
        graphqlSchemaHash: schemaHash,
        errorMessage: undefined,
        errorStack: undefined,
        graphqlContext: undefined,
        graphqlDocument: undefined,
        graphqlResult: undefined,
        graphqlVariables: undefined,
      },
      {
        spanId: "2",
        traceId: "1",
        parentSpanId: "1",
        name: "prisma:client:operation",
        kind: 1,
        startTimeUnixNano: 3,
        endTimeUnixNano: 4,
        isForeign: true,
        attributes:
          '{"method":"findMany","model":"User","name":"User.findMany"}',
        errorMessage: undefined,
        errorStack: undefined,
        graphqlContext: undefined,
        graphqlDocument: undefined,
        graphqlResult: undefined,
        graphqlSchemaHash: undefined,
        graphqlVariables: undefined,
      },
      {
        spanId: "3",
        traceId: "1",
        parentSpanId: "2",
        name: "prisma:engine:db_query",
        kind: 1,
        startTimeUnixNano: 5,
        endTimeUnixNano: 6,
        isForeign: true,
        attributes: '{"db.statement":"SELECT * FROM User"}',
        errorMessage: undefined,
        errorStack: undefined,
        graphqlContext: undefined,
        graphqlDocument: undefined,
        graphqlResult: undefined,
        graphqlSchemaHash: undefined,
        graphqlVariables: undefined,
      },
    ]);
  });
});
