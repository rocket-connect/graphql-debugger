import { z } from 'zod';
import { request } from './utils';
import { ExportTraceServiceRequestSchema } from '../../src/collector/schema';
import { prisma } from '../../src/prisma';
import util from 'util';
import { describe, beforeEach, test, expect } from '@jest/globals';

const sleep = util.promisify(setTimeout);

describe('POST /v1/traces', () => {
  beforeEach(async () => {
    await prisma.span.deleteMany();
    await prisma.traceGroup.deleteMany();
  });

  // Removed input validation for performance reasons
  test.skip('should throw when no body is sent', async () => {
    const response = await request().post('/v1/traces').send({});

    expect(response.status).toBe(400);

    const body = await response.body;

    expect(body.message).toMatchInlineSnapshot(`
"[
  {
    "code": "invalid_type",
    "expected": "array",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans"
    ],
    "message": "Required"
  }
]"
`);
  });

  // Removed input validation for performance reasons
  test.skip('should throw span validation error when not sent correctly', async () => {
    const payload: z.infer<typeof ExportTraceServiceRequestSchema> = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                // @ts-ignore - testing the validation error on a span
                {
                  spanId: '1',
                },
              ],
            },
          ],
        },
      ],
    };

    const response = await request().post('/v1/traces').send(payload);

    expect(response.status).toBe(400);

    const body = await response.body;

    expect(body.message).toMatchInlineSnapshot(`
"[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "traceId"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "name"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "kind"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "startTimeUnixNano"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "endTimeUnixNano"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "array",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "attributes"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "droppedAttributesCount"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "array",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "events"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "droppedEventsCount"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "array",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "links"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "droppedLinksCount"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "object",
    "received": "undefined",
    "path": [
      "body",
      "resourceSpans",
      0,
      "scopeSpans",
      0,
      "spans",
      0,
      "status"
    ],
    "message": "Required"
  }
]"
`);
  });

  test('should receive traces and map them correctly in the database', async () => {
    const payload: z.infer<typeof ExportTraceServiceRequestSchema> = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  spanId: '2a5f8b696abf9858',
                  traceId: '46cb720c4cc8b0c1e28cabd112057b78',
                  parentSpanId: undefined,
                  name: 'query users',
                  kind: 0,
                  attributes: [
                    {
                      key: 'graphql.operation.name',
                      value: {
                        stringValue: 'users',
                      },
                    },
                    {
                      key: 'graphql.operation.type',
                      value: {
                        stringValue: 'query',
                      },
                    },
                    {
                      key: 'graphql.document',
                      value: {
                        stringValue:
                          '{\n' +
                          '  users {\n' +
                          '    name\n' +
                          '    age\n' +
                          '    posts {\n' +
                          '      title\n' +
                          '      content\n' +
                          '      comments {\n' +
                          '        content\n' +
                          '      }\n' +
                          '    }\n' +
                          '  }\n' +
                          '}',
                      },
                    },
                    {
                      key: 'graphql.operation.returnType',
                      value: {
                        stringValue: '[User]',
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
                  spanId: 'b496e68882240e49',
                  traceId: '46cb720c4cc8b0c1e28cabd112057b78',
                  parentSpanId: '2a5f8b696abf9858',
                  name: 'User name',
                  kind: 0,
                  attributes: [],
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
                },
                {
                  spanId: '443fd2e5e4f00845',
                  traceId: '46cb720c4cc8b0c1e28cabd112057b78',
                  parentSpanId: '2a5f8b696abf9858',
                  name: 'User age',
                  kind: 0,
                  attributes: [],
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
                  spanId: 'c96662d3273a7415',
                  traceId: '46cb720c4cc8b0c1e28cabd112057b78',
                  parentSpanId: '2a5f8b696abf9858',
                  name: 'User posts',
                  kind: 0,
                  attributes: [],
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
                  spanId: '4aa8f7495bc7546c',
                  traceId: '46cb720c4cc8b0c1e28cabd112057b78',
                  parentSpanId: 'c96662d3273a7415',
                  name: 'Posts title',
                  kind: 0,
                  attributes: [],
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
                  spanId: 'b8b21753292a8794',
                  traceId: '46cb720c4cc8b0c1e28cabd112057b78',
                  parentSpanId: 'c96662d3273a7415',
                  name: 'Posts content',
                  kind: 0,
                  attributes: [],
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
                  spanId: '3877c153fa0d43d6',
                  traceId: '46cb720c4cc8b0c1e28cabd112057b78',
                  parentSpanId: 'c96662d3273a7415',
                  name: 'Posts comments',
                  kind: 0,
                  attributes: [],
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
                  spanId: '9c027ebcb7fb03a3',
                  traceId: '46cb720c4cc8b0c1e28cabd112057b78',
                  parentSpanId: '3877c153fa0d43d6',
                  name: 'Comment content',
                  kind: 0,
                  attributes: [],
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

    const response = await request().post('/v1/traces').send(payload);

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
  });
});
