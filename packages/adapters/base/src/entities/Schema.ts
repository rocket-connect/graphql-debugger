import {
  FindFirstSchemaWhere,
  ListSchemasWhere,
  PostSchema,
  Schema as TSchema,
} from "@graphql-debugger/types";

export abstract class BaseSchema {
  constructor() {}

  public abstract createOne({
    data,
  }: {
    data: PostSchema["body"] & { hash: string };
  }): Promise<boolean>;

  public abstract findMany({
    where,
  }: {
    where?: ListSchemasWhere;
  }): Promise<TSchema[]>;

  public abstract findFirst({
    where,
  }: {
    where: FindFirstSchemaWhere;
  }): Promise<TSchema | null>;
}
