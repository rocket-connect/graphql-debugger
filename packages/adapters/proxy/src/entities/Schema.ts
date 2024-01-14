import { BaseSchema } from "@graphql-debugger/adapter-base";
import {
  SchemaFragment,
  TraceFragment,
} from "@graphql-debugger/graphql-fragments";
import {
  FindFirstSchemaOptions,
  FindFirstSchemaResponse,
  FindFirstSchemaWhere,
  ListSchemasResponse,
  ListSchemasWhere,
  PostSchema,
  Schema,
  Schema as TSchema,
  UpsertSchemaInput,
  UpsertSchemaWhere,
} from "@graphql-debugger/types";

import axios from "axios";
import { AxiosError } from "axios";

import { executeGraphQLRequest } from "../utils";

export class ProxySchema extends BaseSchema {
  public apiURL: string;
  public collectorURL: string;

  constructor({
    apiURL,
    collectorURL,
  }: {
    apiURL: string;
    collectorURL: string;
  }) {
    super();
    this.apiURL = apiURL;
    this.collectorURL = collectorURL;
  }

  public async createOne({ data }: { data: PostSchema["body"] }) {
    try {
      const repsonse = await axios.post(
        `${this.collectorURL}/v1/schema`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (repsonse.status !== 200) {
        throw new Error("Failed to create schema");
      }

      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message);
      }

      throw error;
    }
  }

  public async findMany({ where }: { where?: ListSchemasWhere } = {}): Promise<
    TSchema[]
  > {
    const query = /* GraphQL */ `
      query ListSchemas($where: ListSchemasWhere) {
        listSchemas(where: $where) {
          schemas {
            ...SchemaFragment
          }
        }
      }

      ${SchemaFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<{
      listSchemas: ListSchemasResponse;
    }>({
      query,
      variables: {
        where,
      },
      url: this.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.listSchemas.schemas;
  }

  public async findFirst({
    where,
    options,
  }: {
    where: FindFirstSchemaWhere;
    options?: FindFirstSchemaOptions;
  }): Promise<TSchema | null> {
    const query = /* GraphQL */ `
      query FindFirstSchema($where: FindFirstSchemaWhere!) {
        findFirstSchema(where: $where) {
          schema {
            ${
              options?.includeTraces
                ? /* GraphQL */ `
                  traceGroups {
                    ...TraceFragment
                  }
                `
                : ``
            }
            ...SchemaFragment
          }
        }
      }

      ${options?.includeTraces ? TraceFragment : ``}
      ${SchemaFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<{
      findFirstSchema: FindFirstSchemaResponse;
    }>({
      query,
      variables: {
        where,
      },
      url: this.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.findFirstSchema.schema || null;
  }

  public async upsert({
    where,
    input,
  }: {
    where: UpsertSchemaWhere;
    input: UpsertSchemaInput;
  }): Promise<Schema> {
    const query = /* GraphQL */ `
      mutation UpsertSchema(
        $where: UpsertSchemaWhere!
        $input: UpsertSchemaInput!
      ) {
        upsertSchema(where: $where, input: $input) {
          schema {
            ...SchemaFragment
          }
        }
      }

      ${SchemaFragment}
    `;

    const { data, errors } = await executeGraphQLRequest<{
      upsertSchema: { schema: Schema };
    }>({
      query,
      variables: {
        where,
        input,
      },
      url: this.apiURL,
    });

    if (errors && errors?.length > 0) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }

    return data.upsertSchema.schema;
  }
}
