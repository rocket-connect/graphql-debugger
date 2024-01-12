import type {
  UpsertSchemaInput,
  UpsertSchemaResponse,
  UpsertSchemaWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { SchemaObject } from "../objects/schema";
import { builder } from "../schema";

const UpsertSchemaInputObject: InputRef<UpsertSchemaInput> = builder.inputType(
  "UpsertSchemaInput",
  {
    fields: (t) => ({
      hash: t.string({
        required: true,
      }),
      typeDefs: t.string({
        required: true,
      }),
    }),
  },
);

const UpsertSchemaWhereObject: InputRef<UpsertSchemaWhere> = builder.inputType(
  "UpsertSchemaWhere",
  {
    fields: (t) => ({
      hash: t.string({
        required: true,
      }),
    }),
  },
);

const UpsertSchemaResponseObject: ObjectRef<UpsertSchemaResponse> =
  builder.objectType("UpsertSchemaResponse", {
    fields: (t) => ({
      schema: t.field({
        type: SchemaObject,
        resolve: (root) => root.schema,
      }),
    }),
  });

builder.mutationField("upsertSchema", (t) =>
  t.field({
    type: UpsertSchemaResponseObject,
    args: {
      where: t.arg({
        type: UpsertSchemaWhereObject,
        required: true,
      }),
      input: t.arg({
        type: UpsertSchemaInputObject,
        required: true,
      }),
    },
    resolve: async (root, args, context) => {
      const schema = await context.client.schema.upsert({
        where: args.where,
        input: args.input,
      });

      return {
        schema,
      };
    },
  }),
);
