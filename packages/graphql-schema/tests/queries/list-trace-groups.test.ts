import { ListTraceGroupsResponseSchema } from "@graphql-debugger/schemas";
import { ListTraceGroupsResponse } from "@graphql-debugger/types";

import gql from "gql-tag";
import util from "util";

import { client } from "../client";
import { createTestSchema, querySchema } from "../utils";
import { request } from "../utils";

const sleep = util.promisify(setTimeout);

const query = gql`
  query {
    listTraceGroups {
      traces {
        id
        traceId
        firstSpanErrorMessage
        firstSpanErrorStack
        firstSpanErrorMessage
        firstSpanErrorStack
        spans {
          ...SpanObject
        }
        rootSpan {
          ...SpanObject
        }
      }
    }
  }

  fragment SpanObject on Span {
    id
    spanId
    traceId
    parentSpanId
    name
    kind
    errorMessage
    errorStack
    endTimeUnixNano
    startTimeUnixNano
    durationNano
    graphqlDocument
    graphqlVariables
    graphqlResult
    graphqlContext
    graphqlOperationName
    graphqlOperationType
    createdAt
    updatedAt
    isForeign
  }
`;

describe("queries/list-trace-groups", () => {
  test("should return a list of trace groups", async () => {
    const testSchema = await createTestSchema({
      client,
    });

    const testSchemaResponse = await querySchema({
      schema: testSchema.schema,
      query: testSchema.query,
    });
    expect(testSchemaResponse.errors).toBeUndefined();
    await sleep(500);

    const apiResponse = await request()
      .post("/graphql")
      .send({ query })
      .set("Accept", "application/json");

    const body = await apiResponse.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(1);

    const parsed = ListTraceGroupsResponseSchema.parse(listTraceGroups);

    expect(parsed).toEqual(listTraceGroups);
  });

  test("should return a list of trace groups filtered by id", async () => {
    const testSchema = await createTestSchema({
      client,
    });

    const testSchemaResponse = await querySchema({
      schema: testSchema.schema,
      query: testSchema.query,
    });
    expect(testSchemaResponse.errors).toBeUndefined();
    await sleep(500);

    const traces = await client.trace.findMany({
      where: {
        schemaId: testSchema.dbSchema.id,
        includeSpans: true,
      },
    });

    const query = gql`
      query ($where: ListTraceGroupsWhere) {
        listTraceGroups(where: $where) {
          traces {
            id
          }
        }
      }
    `;

    const response = await request()
      .post("/graphql")
      .send({ query, variables: { where: { id: traces[0].id } } })
      .set("Accept", "application/json");

    const body = await response.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(1);

    expect(listTraceGroups.traces[0].id).toBe(traces[0].id);
  });

  test("should return a list of trace groups filtered by schemaId", async () => {
    const testSchema = await createTestSchema({
      client,
    });

    const testSchemaResponse = await querySchema({
      schema: testSchema.schema,
      query: testSchema.query,
    });
    expect(testSchemaResponse.errors).toBeUndefined();
    await sleep(500);

    const traces = await client.trace.findMany({
      where: {
        schemaId: testSchema.dbSchema.id,
        includeSpans: true,
      },
    });

    const query = gql`
      query ($where: ListTraceGroupsWhere) {
        listTraceGroups(where: $where) {
          traces {
            id
          }
        }
      }
    `;

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: { where: { schemaId: traces[0].schemaId } },
      })
      .set("Accept", "application/json");

    const body = await response.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(1);

    expect(listTraceGroups.traces[0].id).toBe(traces[0].id);
  });
});
