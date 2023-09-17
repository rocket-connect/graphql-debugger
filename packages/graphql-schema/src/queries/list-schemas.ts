import { prisma } from "@graphql-debugger/data-access";
import type {
  ListSchemasResponse,
  ListSchemasWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { SchemaObject } from "../objects/schema";
import { builder } from "../schema";

const ListSchemasWhereInput: InputRef<ListSchemasWhere> = builder.inputType(
  "ListSchemasWhere",
  {
    fields: (t) => ({
      id: t.string({
        required: false,
      }),
    }),
  },
);

const ListSchemasResponseObject: ObjectRef<ListSchemasResponse> =
  builder.objectType("ListSchemasResponse", {
    fields: (t) => ({
      schemas: t.field({
        type: [SchemaObject],
        resolve: (root) => root.schemas,
      }),
    }),
  });

builder.queryField("listSchemas", (t) =>
  t.field({
    type: ListSchemasResponseObject,
    args: {
      where: t.arg({
        type: ListSchemasWhereInput,
        required: false,
      }),
    },
    resolve: async (root, args) => {
      const where = {
        ...(args.where?.id ? { id: args.where.id } : {}),
      };

      const schemas = await prisma.schema.findMany({
        orderBy: { createdAt: "desc" },
        where,
      });

      return {
        schemas: schemas.map((schema) => ({
          id: schema.id,
          name: schema.name as string | undefined,
          hash: schema.hash,
          typeDefs: schema.typeDefs,
          traceGroups: [],
          createdAt: schema.createdAt.toISOString(),
        })),
      };
    },
  }),
);
