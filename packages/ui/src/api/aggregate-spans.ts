import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  Query,
} from "../graphql-types";
import { api } from "./api";

const AggregateSpansQuery = /* GraphQL */ `
  query ($where: AggregateSpansWhere!) {
    aggregateSpans(where: $where) {
      resolveCount
      errorCount
      averageDuration
      lastResolved
    }
  }
`;

export async function aggregateSpans({
  where,
}: {
  where: AggregateSpansWhere;
}): Promise<AggregateSpansResponse> {
  const { data, errors } = await api<{
    aggregateSpans: Query["aggregateSpans"];
  }>({
    query: AggregateSpansQuery,
    variables: {
      where,
    },
  });

  if (errors && errors?.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }

  return data.aggregateSpans;
}
