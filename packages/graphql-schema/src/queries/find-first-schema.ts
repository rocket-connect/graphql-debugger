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
      schema: t.field({
        type: SchemaObject,
        nullable: true,
        resolve: (root) => root.schema,
      }),
    }),
  });

builder.queryField("findFirstSchema", (t) =>
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
          ...(args.where?.hash ? { hash: args.where.hash } : {}),
        },
      });

      return {
        schema,
      };
    },
  }),
);
