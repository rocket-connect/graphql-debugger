import {
  ListSchemasResponse,
  ListSchemasWhere,
  Schema as TSchema,
} from "@graphql-debugger/types";

import { ClientOptions } from "../types";
import { executeGraphQLRequest } from "../utils";

export class Schema {
  private clientOptions: ClientOptions;

  constructor(clientOptions: ClientOptions) {
    this.clientOptions = clientOptions;
  }

  public async findMany({ where }: { where?: ListSchemasWhere } = {}): Promise<
    TSchema[]
  > {
    const query = /* GraphQL */ `
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

    const { data, errors } = await executeGraphQLRequest<{
      listSchemas: ListSchemasResponse;
    }>({
      query,
      variables: {
        where,
      },
      url: this.clientOptions.backendUrl as string,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.listSchemas.schemas;
  }
}
