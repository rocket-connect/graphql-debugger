import {
  FindFirstSchemaResponse,
  FindFirstSchemaWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { SchemaObject } from "../objects/schema";
import { builder } from "../schema";

const FindFirstSchemaWhereInput: InputRef<FindFirstSchemaWhere> =
  builder.inputType("FindFirstSchemaWhere", {
    fields: (t) => ({
      hash: t.string({
        required: true,
      }),
    }),
  });

const FindFirstSchemaResponseObject: ObjectRef<FindFirstSchemaResponse> =
  builder.objectType("FindFirstSchemaResponse", {
    fields: (t) => ({
      schemas: t.field({
        type: SchemaObject,
        nullable: true,
        resolve: (root) => root.schema,
      }),
    }),
  });

builder.queryField("FindFirstSchema", (t) =>
  t.field({
    type: FindFirstSchemaResponseObject,
    args: {
      where: t.arg({
        type: FindFirstSchemaWhereInput,
        required: true,
      }),
    },
    resolve: async (root, args, context) => {
      const schema = await context.client.schema.findFirst({
        where: {
          hash: args.where.hash,
        },
      });

      return {
        schema,
      };
    },
  }),
);
