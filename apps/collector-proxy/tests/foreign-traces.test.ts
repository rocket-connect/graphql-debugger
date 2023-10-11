import { prisma } from "@graphql-debugger/data-access";
import { TRACER_NAME } from "@graphql-debugger/opentelemetry";
import {
  AttributeNames,
  PostTraces,
  ResourceSpans,
} from "@graphql-debugger/types";

import { faker } from "@faker-js/faker";
import { describe, expect, test } from "@jest/globals";
import { parse, print } from "graphql";
import util from "util";

import { request } from "./utils";

const sleep = util.promisify(setTimeout);

describe("foreign traces", () => {
  test("should receive foreign traces and map them correctly in the database", async () => {
    const knownScope: ResourceSpans["scopeSpans"][0]["scope"] = {
      name: TRACER_NAME,
    };

    const foreignScope: ResourceSpans["scopeSpans"][0]["scope"] = {
      name: "prisma",
    };

    const schemaHash = faker.string.alpha(6);

    const document = /* GraphQL */ `
      query {
        users {
          name
        }
      }
    `;

    const payload: PostTraces["body"] = {
      resourceSpans: [
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
                  droppedAttributesCount: 0,
                  startTimeUnixNano: 1,
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
                  spanId: "2",
                  traceId: "1",
                  parentSpanId: "1",
                  name: "User name",
                  kind: 0,
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
                  attributes: [
                    {
                      key: AttributeNames.SCHEMA_HASH,
                      value: {
                        stringValue: schemaHash,
                      },
                    },
                  ],
                },
              ],
            },
            {
              scope: foreignScope,
              spans: [
                {
                  spanId: "3",
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
                  spanId: "4",
                  traceId: "1",
                  parentSpanId: "3",
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
      ],
    };

    const response = await request().post("/v1/traces").send(payload);

    expect(response.status).toBe(200);

    await sleep(2000); // backoff the writes using sqlite

    const traceGroup = await prisma.traceGroup.findFirst({
      where: {
        traceId: payload.resourceSpans[0].scopeSpans[0].spans[0].traceId,
      },
      select: {
        spans: true,
      },
    });

    expect(traceGroup).toBeDefined();
    expect(traceGroup?.spans.length).toEqual(4);

    const rootSpan = traceGroup?.spans.find((span) => span.isGraphQLRootSpan);
    expect(rootSpan).toBeDefined();
    expect(rootSpan?.name).toEqual("query users");
    expect(rootSpan?.graphqlDocument).toEqual(print(parse(document)));

    const foreignSpans = traceGroup?.spans.filter(
      (span) => span.isForeign === true,
    );
    expect(foreignSpans?.length).toEqual(2);

    const prismaClientSpan = foreignSpans?.find(
      (span) => span.name === "prisma:client:operation",
    );
    expect(prismaClientSpan).toBeDefined();

    const prismaEngineSpan = foreignSpans?.find(
      (span) => span.name === "prisma:engine:db_query",
    );
    expect(prismaEngineSpan).toBeDefined();
    expect(prismaEngineSpan?.attributes).toEqual(
      '{"db.statement":"SELECT * FROM User"}',
    );
  });
});
