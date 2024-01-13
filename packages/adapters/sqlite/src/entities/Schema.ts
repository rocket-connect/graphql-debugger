import { BaseSchema } from "@graphql-debugger/adapter-base";
import {
  FindFirstSchemaOptions,
  FindFirstSchemaWhere,
  ListSchemasWhere,
  PostSchema,
  Schema,
  UpsertSchemaInput,
  UpsertSchemaWhere,
} from "@graphql-debugger/types";

import { SchemaSchema } from "../../../../schemas/build";
import { prisma } from "../prisma";

export class SQLiteSchema extends BaseSchema {
  constructor() {
    super();
  }

  public async createOne({
    data,
  }: {
    data: PostSchema["body"] & { hash: string };
  }) {
    const result = await prisma.$transaction(async () => {
      const schema = await prisma.schema.findFirst({
        where: {
          hash: data.hash,
        },
      });

      if (schema) {
        return false;
      }

      await prisma.schema.create({
        data: {
          hash: data.hash,
          typeDefs: data.schema,
        },
      });

      return true;
    });

    return result;
  }

  public async findMany(
    args: { where?: ListSchemasWhere } = {},
  ): Promise<Schema[]> {
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

    const response = schemas.map((schema) => ({
      id: schema.id,
      name: schema.name as string | undefined,
      hash: schema.hash,
      typeDefs: schema.typeDefs,
      traceGroups: [],
      createdAt: schema.createdAt.toISOString(),
    }));

    const parsed = SchemaSchema.array().parse(response);

    return parsed;
  }

  public async findFirst({
    where,
    options,
  }: {
    where?: FindFirstSchemaWhere;
    options?: FindFirstSchemaOptions;
  }): Promise<Schema | null> {
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

    const response = {
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

    const parsed = SchemaSchema.parse(response);

    return parsed;
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

    const response = {
      id: schema.id,
      name: schema.name as string | undefined,
      hash: schema.hash,
      typeDefs: schema.typeDefs,
      traceGroups: [],
      createdAt: schema.createdAt.toISOString(),
    };

    const parsed = SchemaSchema.parse(response);

    return parsed;
  }
}
