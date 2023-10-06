import {
  DeleteTracesResponse,
  DeleteTracesWhere,
} from "@graphql-debugger/types";

import { executeGraphQLRequest } from "./executeGraphQLRequest";

const DeleteTracesQuery = /* GraphQL */ `
  mutation ($where: DeleteTracesWhere!) {
    deleteTraces(where: $where) {
      success
    }
  }
`;

export async function deleteTraces({
  where,
}: {
  where?: DeleteTracesWhere;
} = {}): Promise<void> {
  const { errors } = await executeGraphQLRequest<{
    deleteTraces: DeleteTracesResponse;
  }>({
    query: DeleteTracesQuery,
    variables: {
      where,
    },
  });

  if (errors && errors?.length > 0) {
    console.error(new Error(errors.map((e) => e.message).join("\n")));
  }
}
