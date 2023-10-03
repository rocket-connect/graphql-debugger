import { parse, print } from "graphql";

import { API_URL } from "../config";
import type {
  GraphQLRequest,
  GraphQLResponse,
  GraphQLResponseData,
} from "./types";

export const executeGraphQLRequest = async <Data, Variables = unknown>({
  query,
  variables,
}: GraphQLRequest<Variables>): Promise<GraphQLResponseData<Data>> => {
  const validQuery = print(parse(query));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: validQuery,
      ...(variables && { variables }),
    }),
  });

  const { data, errors }: GraphQLResponse<Data> = await response.json();

  return { data: data, errors: errors || [] };
};
