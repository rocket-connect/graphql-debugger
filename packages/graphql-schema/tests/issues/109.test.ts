import { ListTraceGroupsResponse } from "@graphql-debugger/types";

import gql from "gql-tag";

import { client } from "../client";
import { createTestTraceGroup } from "../utils";
import { request } from "../utils";

const query = gql`
  query {
    listTraceGroups {
      traces {
        id
      }
    }
  }
`;

describe("issues 109", () => {
  test("should not return a trace when there is no root graphql span", async () => {
    await createTestTraceGroup({
      client,
    });

    const apiResponse = await request()
      .post("/graphql")
      .send({ query })
      .set("Accept", "application/json");

    const body = await apiResponse.body;

    const listTraceGroups = body.data
      ?.listTraceGroups as ListTraceGroupsResponse;

    expect(listTraceGroups.traces.length).toBe(0);
  });
});
