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

import { HttpServerAttributeNames } from "../../../plugins/express/src/attributes";
import { client } from "../src/client";
import { request } from "./utils";

const sleep = util.promisify(setTimeout);

describe("plugin express", () => {
  test("should receive and store a express trace", async () => {
    const knownScope: ResourceSpans["scopeSpans"][0]["scope"] = {
      name: TRACER_NAME,
    };

    const schemaHash = faker.string.alpha(6);

    const document = /* GraphQL */ `
      query {
        users {
          name
        }
      }
    `;

    const expressScopeSpan: ResourceSpans["scopeSpans"][0] = {
      scope: knownScope,
      spans: [
        {
          spanId: "1",
          traceId: "1",
          parentSpanId: undefined, // In this case the express plugin is the root span
          name: "HTTP POST /graphql",
          kind: 1,
          startTimeUnixNano: { high: 3, low: 3 },
          endTimeUnixNano: { high: 4, low: 4 },
          attributes: [
            {
              key: HttpServerAttributeNames.HTTP_ROUTE,
              value: {
                stringValue: "/graphql",
              },
            },
            {
              key: HttpServerAttributeNames.CLIENT_ADDRESS,
              value: {
                stringValue: "123",
              },
            },
            {
              key: HttpServerAttributeNames.CLIENT_PORT,
              value: {
                stringValue: "123",
              },
            },
            {
              key: HttpServerAttributeNames.URL_PATH,
              value: {
                stringValue: "/graphql",
              },
            },
          ],
          status: {
            code: 0,
          },
        },
      ],
    };

    const payload: PostTraces["body"] = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              scope: knownScope,
              spans: [
                {
                  spanId: "2",
                  traceId: "1",
                  parentSpanId: "1",
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
                  startTimeUnixNano: {
                    high: 1,
                    low: 1,
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
                  traceId: "1",
                  parentSpanId: "2",
                  name: "User name",
                  kind: 0,
                  droppedAttributesCount: 0,
                  startTimeUnixNano: {
                    high: 1,
                    low: 1,
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
            expressScopeSpan,
          ],
        },
      ],
    };

    const response = await request().post("/v1/traces").send(payload);
    expect(response.status).toBe(200);

    await sleep(2000); // backoff the writes using sqlite

    const traceGroup = await client.trace.findFirst({
      where: {
        traceId: expressScopeSpan.spans[0].traceId,
      },
      options: {
        includeSpans: true,
      },
    });
    expect(traceGroup).toBeDefined();
    expect(traceGroup?.spans.length).toEqual(3);

    const rootSpan = traceGroup?.spans.find((span) => span.isGraphQLRootSpan);
    expect(rootSpan).toBeDefined();
    expect(rootSpan?.name).toEqual("query users");
    expect(rootSpan?.graphqlDocument).toEqual(print(parse(document)));

    const nameSpan = traceGroup?.spans.find(
      (span) => span.name === "User name",
    );
    expect(nameSpan).toBeDefined();

    const expressSpan = traceGroup?.spans.find(
      (span) => span.name === "HTTP POST /graphql",
    );
    expect(expressSpan).toBeDefined();
  });
});
