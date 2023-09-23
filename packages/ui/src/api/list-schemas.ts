import {
  ListSchemasResponse,
  ListSchemasWhere,
  Schema,
} from "@graphql-debugger/types";

import { api } from "./api";

const ListSchemasQuery = /* GraphQL */ `
  query ($where: ListSchemasWhere) {
    listSchemas(where: $where) {
      schemas {
        id
        name
        hash
        typeDefs
        createdAt
      }
    }
  }
`;

export async function listSchemas({
  where,
}: { where?: ListSchemasWhere } = {}): Promise<Schema[]> {
  const { data, errors } = await api<{
    listSchemas: ListSchemasResponse;
  }>({
    query: ListSchemasQuery,
    variables: {
      where,
    },
  });

  if (errors && errors?.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }

  return data.listSchemas.schemas;
}

export async function getSchema(id: string): Promise<Schema> {
  const schemas = await listSchemas({
    where: {
      id,
    },
  });

  const schema = schemas.find((s) => s.id === id);

  if (!schema) {
    throw new Error(`Schema with id ${id} not found`);
  }

  return schema;
}
