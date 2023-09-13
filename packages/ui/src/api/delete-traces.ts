import { graphql } from "@graphql-debugger/types";
import { api } from "./api";

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
  where?: graphql.DeleteTracesWhere;
} = {}): Promise<void> {
  const { errors } = await api<{
    deleteTraces: graphql.Mutation["deleteTraces"];
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
