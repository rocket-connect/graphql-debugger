import {
  ListSchemasResponse,
  ListSchemasWhere,
  PostSchema,
  Schema as TSchema,
} from "@graphql-debugger/types";

import axios from "axios";

import { ClientOptions } from "../types";
import { executeGraphQLRequest } from "../utils";

export class Schema {
  private clientOptions: ClientOptions;

  constructor(clientOptions: ClientOptions) {
    this.clientOptions = clientOptions;
  }

  public async createOne({ data }: { data: PostSchema["body"] }) {
    const repsonse = await axios.post(
      `${this.clientOptions.collectorUrl}/v1/schema`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    if (repsonse.status !== 200) {
      throw new Error("Failed to create schema");
    }

    return true;
  }

  public async findMany({ where }: { where?: ListSchemasWhere } = {}): Promise<
    TSchema[]
  > {
    const query = /* GraphQL */ `
      query ListSchemas($where: ListSchemasWhere) {
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
