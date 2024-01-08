import { ListSchemasResponse, ListSchemasWhere } from "@graphql-debugger/types";

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
      schemaHashes: t.stringList({
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
    resolve: async (root, args, context) => {
      const where = {
        ...(args.where?.id ? { id: args.where.id } : {}),
        ...(args.where?.schemaHashes
          ? { schemaHashes: args.where.schemaHashes }
          : {}),
      };

      const schemas = await context.client.schema.findMany({
        where,
      });

      return {
        schemas,
      };
    },
  }),
);
