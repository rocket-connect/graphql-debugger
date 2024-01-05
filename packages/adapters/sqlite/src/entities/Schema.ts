import { BaseSchema } from "@graphql-debugger/adapter-base";
import { prisma } from "@graphql-debugger/data-access";
import {
  FindFirstSchemaWhere,
  ListSchemasWhere,
  PostSchema,
  Schema as TSchema,
} from "@graphql-debugger/types";

export class SQLiteSchema extends BaseSchema {
  constructor() {
    super();
  }

  public async createOne({
    data,
  }: {
    data: PostSchema["body"] & { hash: string };
  }) {
    await prisma.schema.create({
      data: {
        hash: data.hash,
        typeDefs: data.schema,
      },
    });

    return true;
  }

  public async findMany(
    args: { where?: ListSchemasWhere } = {},
  ): Promise<TSchema[]> {
    const where = {
      ...(args.where?.id ? { id: args.where.id } : {}),
    };
    const schemas = await prisma.schema.findMany({
      orderBy: { createdAt: "desc" },
      where,
    });

    return schemas.map((schema) => ({
      id: schema.id,
      name: schema.name as string | undefined,
      hash: schema.hash,
      typeDefs: schema.typeDefs,
      traceGroups: [],
      createdAt: schema.createdAt.toISOString(),
    }));
  }

  public async findFirst({
    where,
  }: {
    where: FindFirstSchemaWhere;
  }): Promise<TSchema | null> {
    const schema = await prisma.schema.findFirst({
      where: {
        hash: where.hash,
      },
    });

    if (!schema) {
      return null;
    }

    return {
      id: schema.id,
      name: schema.name as string | undefined,
      hash: schema.hash,
      typeDefs: schema.typeDefs,
      traceGroups: [],
      createdAt: schema.createdAt.toISOString(),
    };
  }
}
