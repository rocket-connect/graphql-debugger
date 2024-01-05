import { BaseSchema } from "@graphql-debugger/adapter-base";
import {
  FindFirstSchemaResponse,
  FindFirstSchemaWhere,
  ListSchemasResponse,
  ListSchemasWhere,
  PostSchema,
  Schema as TSchema,
} from "@graphql-debugger/types";

import axios from "axios";

import { ProxyAdapterOptions } from "..";
import { executeGraphQLRequest } from "../utils";

export class ProxySchema extends BaseSchema {
  public options: ProxyAdapterOptions;

  constructor(options: ProxyAdapterOptions) {
    super();
    this.options = options;
  }

  public async createOne({ data }: { data: PostSchema["body"] }) {
    const repsonse = await axios.post(
      `${this.options.collectorUrl}/v1/schema`,
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
      url: this.options.backendUrl,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.listSchemas.schemas;
  }

  public async findFirst({
    where,
  }: {
    where: FindFirstSchemaWhere;
  }): Promise<TSchema | null> {
    const query = /* GraphQL */ `
      query FindFirstSchema($where: FirstFirstSchemaWhere) {
        findFirstSchema(where: $where) {
          schema {
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
      findFirstSchema: FindFirstSchemaResponse;
    }>({
      query,
      variables: {
        where,
      },
      url: this.options.backendUrl,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.findFirstSchema.schema || null;
  }
}
