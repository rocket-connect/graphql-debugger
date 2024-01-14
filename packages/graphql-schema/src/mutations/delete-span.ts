import type {
  DeleteSpanResponse,
  DeleteSpanWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { builder } from "../schema";

const DeleteSpanWhereObject: InputRef<DeleteSpanWhere> = builder.inputType(
  "DeleteSpanWhere",
  {
    fields: (t) => ({
      id: t.string({
        required: true,
      }),
    }),
  },
);

const DeleteSpanResponseObject: ObjectRef<DeleteSpanResponse> =
  builder.objectType("DeleteSpanResponse", {
    fields: (t) => ({
      success: t.field({
        type: "Boolean",
        resolve: (root) => root.success,
      }),
    }),
  });

builder.mutationField("deleteSpan", (t) =>
  t.field({
    type: DeleteSpanResponseObject,
    args: {
      where: t.arg({
        type: DeleteSpanWhereObject,
        required: true,
      }),
    },
    resolve: async (root, args, context) => {
      const result = await context.client.span.deleteOne({
        where: args.where,
      });

      return result;
    },
  }),
);
