import {
  FindFirstSchemaWhere,
  ListSchemasWhere,
  PostSchema,
  Schema,
  UpsertSchemaInput,
  UpsertSchemaWhere,
} from "@graphql-debugger/types";

export abstract class BaseSchema {
  constructor() {}

  public abstract createOne({
    data,
  }: {
    data: PostSchema["body"] & { hash?: string };
  }): Promise<boolean>;

  public abstract findMany({
    where,
  }: {
    where?: ListSchemasWhere;
  }): Promise<Schema[]>;

  public abstract findFirst({
    where,
  }: {
    where: FindFirstSchemaWhere;
  }): Promise<Schema | null>;

  public abstract upsert({
    where,
    input,
  }: {
    where: UpsertSchemaWhere;
    input: UpsertSchemaInput;
  }): Promise<Schema>;
}
