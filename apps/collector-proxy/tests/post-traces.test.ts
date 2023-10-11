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

describe("POST /v1/traces", () => {
  test("should throw when no body is sent", async () => {
    const response = await request().post("/v1/traces").send({});

    expect(response.status).toBe(400);

    const body = await response.body;

    expect(body.message).toMatchSnapshot();
  });

  test("should throw span validation error when not sent correctly", async () => {
    const knownScope: ResourceSpans["scopeSpans"][0]["scope"] = {
      name: TRACER_NAME,
    };

    const payload: PostTraces["body"] = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              scope: knownScope,
              spans: [
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - testing the validation error on a span
                {
                  spanId: "1",
                },
              ],
            },
          ],
        },
      ],
    };

    const response = await request().post("/v1/traces").send(payload);

    expect(response.status).toBe(400);

    const body = await response.body;

    expect(body.message).toMatchSnapshot();
  });

  test("should receive traces and map them correctly in the database", async () => {
    const knownScope: ResourceSpans["scopeSpans"][0]["scope"] = {
      name: TRACER_NAME,
    };

    const schemaHash = faker.string.alpha(6);

    const document = /* GraphQL */ `
      query {
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

    const payload: PostTraces["body"] = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              scope: knownScope,
              spans: [
                {
                  spanId: "2a5f8b696abf9858",
                  traceId: "46cb720c4cc8b0c1e28cabd112057b78",
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
                  startTimeUnixNano: 1692991856402000,
                  endTimeUnixNano: 1692991857440000,
                  droppedEventsCount: 0,
                  droppedLinksCount: 0,
                  events: [],
                  links: [],
                  status: {
                    code: 0,
                  },
                },
                {
                  spanId: "b496e68882240e49",
                  traceId: "46cb720c4cc8b0c1e28cabd112057b78",
                  parentSpanId: "2a5f8b696abf9858",
                  name: "User name",
                  kind: 0,
                  droppedAttributesCount: 0,
                  startTimeUnixNano: 1692991857440000,
                  endTimeUnixNano: 1692991857452000,
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
                {
                  spanId: "443fd2e5e4f00845",
                  traceId: "46cb720c4cc8b0c1e28cabd112057b78",
                  parentSpanId: "2a5f8b696abf9858",
                  name: "User age",
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
                  startTimeUnixNano: 1692991857440000,
                  endTimeUnixNano: 1692991857442000,
                  droppedEventsCount: 0,
                  droppedLinksCount: 0,
                  events: [],
                  links: [],
                  status: {
                    code: 0,
                  },
                },
                {
                  spanId: "c96662d3273a7415",
                  traceId: "46cb720c4cc8b0c1e28cabd112057b78",
                  parentSpanId: "2a5f8b696abf9858",
                  name: "User posts",
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
                  startTimeUnixNano: 1692991857441000,
                  endTimeUnixNano: 1692991869442000,
                  droppedEventsCount: 0,
                  droppedLinksCount: 0,
                  events: [],
                  links: [],
                  status: {
                    code: 0,
                  },
                },
                {
                  spanId: "4aa8f7495bc7546c",
                  traceId: "46cb720c4cc8b0c1e28cabd112057b78",
                  parentSpanId: "c96662d3273a7415",
                  name: "Posts title",
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
                  startTimeUnixNano: 1692991859445000,
                  endTimeUnixNano: 1692991859446000,
                  droppedEventsCount: 0,
                  droppedLinksCount: 0,
                  events: [],
                  links: [],
                  status: {
                    code: 0,
                  },
                },
                {
                  spanId: "b8b21753292a8794",
                  traceId: "46cb720c4cc8b0c1e28cabd112057b78",
                  parentSpanId: "c96662d3273a7415",
                  name: "Posts content",
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
                  startTimeUnixNano: 1692991859445000,
                  endTimeUnixNano: 1692991859447000,
                  droppedEventsCount: 0,
                  droppedLinksCount: 0,
                  events: [],
                  links: [],
                  status: {
                    code: 0,
                  },
                },
                {
                  spanId: "3877c153fa0d43d6",
                  traceId: "46cb720c4cc8b0c1e28cabd112057b78",
                  parentSpanId: "c96662d3273a7415",
                  name: "Posts comments",
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
                  startTimeUnixNano: 1692991859445000,
                  endTimeUnixNano: 1692991862447000,
                  droppedEventsCount: 0,
                  droppedLinksCount: 0,
                  events: [],
                  links: [],
                  status: {
                    code: 0,
                  },
                },
                {
                  spanId: "9c027ebcb7fb03a3",
                  traceId: "46cb720c4cc8b0c1e28cabd112057b78",
                  parentSpanId: "3877c153fa0d43d6",
                  name: "Comment content",
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
                  startTimeUnixNano: 1692991862457000,
                  endTimeUnixNano: 1692991862458000,
                  droppedEventsCount: 0,
                  droppedLinksCount: 0,
                  events: [],
                  links: [],
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
    expect(traceGroup?.spans.length).toEqual(8);
    traceGroup?.spans.forEach((span) => {
      expect(span.isForeign).toEqual(false);
      expect(span.graphqlSchemaHash).toEqual(schemaHash);
    });

    const rootSpan = traceGroup?.spans.find((span) => span.isGraphQLRootSpan);
    expect(rootSpan).toBeDefined();
    expect(rootSpan?.name).toEqual("query users");
    expect(rootSpan?.graphqlDocument).toEqual(print(parse(document)));
  });
});
