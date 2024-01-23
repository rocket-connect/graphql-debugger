import axios from "axios";
import { AxiosError } from "axios";
import { parse, print } from "graphql";

import type {
  GraphQLRequest,
  GraphQLResponse,
  GraphQLResponseData,
} from "./types";

export const executeGraphQLRequest = async <Data, Variables = unknown>({
  query,
  variables,
  url,
}: GraphQLRequest<Variables>): Promise<GraphQLResponseData<Data>> => {
  const validQuery = print(parse(query));

  const repsonse = await axios
    .post(
      `${url}/graphql`,
      {
        query: validQuery,
        ...(variables && { variables }),
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    )
    .catch((e) => {
      if (e instanceof AxiosError) {
        throw new Error(JSON.stringify(e.response?.data, null, 2));
      }
      throw e;
    });

  const { data, errors }: GraphQLResponse<Data> = repsonse.data;

  return { data: data, errors: errors || [] };
};
