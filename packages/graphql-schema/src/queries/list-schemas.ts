import { prisma } from "@graphql-debugger/data-access";
import { SchemaObject, Schema } from "../objects/schema";
import { builder } from "../schema";

export type ListSchemasWhere = {
  id?: string;
};

export type ListSchemasResponse = {
  schemas: Schema[];
};

export const ListSchemasWhere = builder.inputType("ListSchemasWhere", {
  fields: (t) => ({
    id: t.string({
      required: false,
    }),
  }),
});

export const ListSchemasResponse = builder.objectType("ListSchemasResponse", {
  fields: (t) => ({
    schemas: t.expose("schemas", {
      type: [SchemaObject],
    }),
  }),
});

builder.queryField("listSchemas", (t) =>
  t.field({
    type: ListSchemasResponse,
    args: {
      where: t.arg({
        type: ListSchemasWhere,
        required: false,
      }),
    },
    resolve: async (root, args) => {
      const where = {
        ...(args.where?.id ? { id: args.where.id } : {}),
      };

      const schemas = await prisma.schema.findMany({ where });

      return {
        schemas: schemas.map((schema) => ({
          id: schema.id,
          name: schema.name as string | undefined,
          hash: schema.hash,
          typeDefs: schema.typeDefs,
          traceGroups: [],
          createdAt: schema.createdAt,
        })),
      };
    },
  }),
);
