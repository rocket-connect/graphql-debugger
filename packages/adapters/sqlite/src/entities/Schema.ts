import { BaseSchema } from "@graphql-debugger/adapter-base";
import { prisma } from "@graphql-debugger/data-access";
import {
  FindFirstSchemaOptions,
  FindFirstSchemaWhere,
  ListSchemasWhere,
  PostSchema,
  Schema,
  Schema as TSchema,
  UpsertSchemaInput,
  UpsertSchemaWhere,
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
      ...(args.where?.schemaHashes
        ? { hash: { in: args.where.schemaHashes } }
        : {}),
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
    options,
  }: {
    where?: FindFirstSchemaWhere;
    options?: FindFirstSchemaOptions;
  }): Promise<TSchema | null> {
    const schema = await prisma.schema.findFirst({
      where: {
        ...(where?.hash ? { hash: where.hash } : {}),
      },
      include: {
        ...(options?.includeTraces ? { traceGroups: true } : {}),
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
      traceGroups: (schema.traceGroups || []).map((traceGroup) => ({
        id: traceGroup.id,
        schemaId: traceGroup.schemaId,
        traceId: traceGroup.traceId,
        spans: [],
      })),
      createdAt: schema.createdAt.toISOString(),
    };
  }

  public async upsert({
    where,
    input,
  }: {
    where: UpsertSchemaWhere;
    input: UpsertSchemaInput;
  }): Promise<Schema> {
    const schema = await prisma.schema.upsert({
      where: {
        hash: where.hash,
      },
      create: {
        hash: input.hash,
        typeDefs: input.typeDefs,
      },
      update: {},
    });

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
