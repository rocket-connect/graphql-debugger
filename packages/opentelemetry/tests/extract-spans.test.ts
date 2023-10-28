import { AttributeNames, ResourceSpans } from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";
import { parse, print } from "graphql";

import { extractSpans } from "../src/extract-spans";
import { TRACER_NAME, TRACER_VERSION } from "../src/tracer";
import { unixNanoToBigInt } from "../src/unix-nano-to-bigint";

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
                  {
                    key: AttributeNames.OPERATION_ROOT,
                    value: {
                      boolValue: true,
                    },
                  },
                ],
                droppedAttributesCount: 0,
                startTimeUnixNano: {
                  high: 1,
                  low: 1,
                },
                endTimeUnixNano: {
                  high: 1,
                  low: 1,
                },
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
                startTimeUnixNano: {
                  high: 2,
                  low: 2,
                },
                endTimeUnixNano: {
                  high: 2,
                  low: 2,
                },
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
                startTimeUnixNano: {
                  high: 3,
                  low: 3,
                },
                endTimeUnixNano: {
                  high: 3,
                  low: 3,
                },
                droppedEventsCount: 0,
                droppedLinksCount: 0,
                events: [
                  {
                    name: "exception",
                    timeUnixNano: {
                      high: 3,
                      low: 3,
                    },
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
        startTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[0].startTimeUnixNano,
        ).toString(),
        endTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[0].endTimeUnixNano,
        ).toString(),
        graphqlSchemaHash: schemaHash,
        graphqlDocument: document,
        graphqlVariables: variables,
        graphqlResult: result,
        graphqlContext: context,
        errorMessage: undefined,
        errorStack: undefined,
        isForeign: false,
        attributes: {
          [AttributeNames.OPERATION_NAME]: "users",
          [AttributeNames.OPERATION_RETURN_TYPE]: "[User]",
          [AttributeNames.OPERATION_TYPE]: "query",
          [AttributeNames.OPERATION_ROOT]: true,
        },
      },
      {
        spanId: "2",
        traceId: "2",
        parentSpanId: "1",
        name: "User name",
        kind: 0,
        startTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[1].startTimeUnixNano,
        ).toString(),
        endTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[1].endTimeUnixNano,
        ).toString(),
        graphqlSchemaHash: schemaHash,
        graphqlDocument: undefined,
        graphqlVariables: undefined,
        graphqlResult: undefined,
        graphqlContext: undefined,
        errorMessage: undefined,
        errorStack: undefined,
        isForeign: false,
        attributes: {},
      },
      {
        spanId: "3",
        traceId: "3",
        parentSpanId: "1",
        name: "User errorField",
        kind: 0,
        startTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[2].startTimeUnixNano,
        ).toString(),
        endTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[2].endTimeUnixNano,
        ).toString(),
        graphqlSchemaHash: schemaHash,
        graphqlDocument: undefined,
        graphqlVariables: undefined,
        graphqlResult: undefined,
        graphqlContext: undefined,
        errorMessage: error.message,
        errorStack: undefined,
        isForeign: false,
        attributes: {},
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
                  {
                    key: AttributeNames.OPERATION_ROOT,
                    value: {
                      boolValue: true,
                    },
                  },
                ],
                startTimeUnixNano: {
                  high: 1,
                  low: 1,
                },
                endTimeUnixNano: {
                  high: 2,
                  low: 2,
                },
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
                startTimeUnixNano: {
                  high: 3,
                  low: 3,
                },
                endTimeUnixNano: {
                  high: 3,
                  low: 3,
                },
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
                startTimeUnixNano: {
                  high: 3,
                  low: 4,
                },
                endTimeUnixNano: {
                  high: 4,
                  low: 4,
                },
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
                startTimeUnixNano: {
                  high: 5,
                  low: 5,
                },
                endTimeUnixNano: {
                  high: 6,
                  low: 6,
                },
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
        startTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[0].startTimeUnixNano,
        ).toString(),
        endTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[0].endTimeUnixNano,
        ).toString(),
        isForeign: false,
        graphqlSchemaHash: schemaHash,
        graphqlDocument: "{\n  users {\n    name\n  }\n}",
        parentSpanId: undefined,
        errorMessage: undefined,
        errorStack: undefined,
        graphqlContext: undefined,
        graphqlResult: undefined,
        graphqlVariables: undefined,
        attributes: {
          [AttributeNames.OPERATION_NAME]: "users",
          [AttributeNames.OPERATION_RETURN_TYPE]: "[User]",
          [AttributeNames.OPERATION_TYPE]: "query",
          [AttributeNames.OPERATION_ROOT]: true,
        },
      },
      {
        spanId: "4",
        traceId: "1",
        parentSpanId: "1",
        name: "User name",
        kind: 0,
        startTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[1].startTimeUnixNano,
        ).toString(),
        endTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[0].spans[1].endTimeUnixNano,
        ).toString(),
        isForeign: false,
        graphqlSchemaHash: schemaHash,
        errorMessage: undefined,
        errorStack: undefined,
        graphqlContext: undefined,
        graphqlDocument: undefined,
        graphqlResult: undefined,
        graphqlVariables: undefined,
        attributes: {},
      },
      {
        spanId: "2",
        traceId: "1",
        parentSpanId: "1",
        name: "prisma:client:operation",
        kind: 1,
        startTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[1].spans[0].startTimeUnixNano,
        ).toString(),
        endTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[1].spans[0].endTimeUnixNano,
        ).toString(),
        isForeign: true,
        attributes: {
          method: "findMany",
          model: "User",
          name: "User.findMany",
        },
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
        startTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[1].spans[1].startTimeUnixNano,
        ).toString(),
        endTimeUnixNano: unixNanoToBigInt(
          resourceSpans[0].scopeSpans[1].spans[1].endTimeUnixNano,
        ).toString(),
        isForeign: true,
        attributes: { "db.statement": "SELECT * FROM User" },
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
