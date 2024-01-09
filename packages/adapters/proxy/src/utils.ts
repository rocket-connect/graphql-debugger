import axios from "axios";
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

  const repsonse = await axios.post(
    `${url}/graphql`,
    {
      query: validQuery,
      ...(variables && { variables }),
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  const { data, errors }: GraphQLResponse<Data> = repsonse.data;

  return { data: data, errors: errors || [] };
};
