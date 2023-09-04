import { graphql } from "@graphql-debugger/utils";
import { API_URL } from "../config";

export async function api<D = unknown>({
  query,
  variables,
}: {
  query: any;
  variables?: any;
}): Promise<{ data: D; errors: any[] }> {
  const validQuery = graphql.print(graphql.parse(query));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: validQuery, variables }),
  });

  const { data, errors } = await response.json();

  return { data: data as D, errors: (errors || []) as any[] };
}
