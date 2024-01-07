import { ListSpansResponse, ListSpansWhere } from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { SpanObject } from "../objects/span";
import { builder } from "../schema";

const ListSpansWhereInput: InputRef<ListSpansWhere> = builder.inputType(
  "ListSpansWhere",
  {
    fields: (t) => ({
      spanIds: t.stringList({
        required: false,
        defaultValue: [],
      }),
    }),
  },
);

const ListSpansResponseObject: ObjectRef<ListSpansResponse> =
  builder.objectType("ListSpansResponse", {
    fields: (t) => ({
      schemas: t.field({
        type: [SpanObject],
        resolve: (root) => root.spans,
      }),
    }),
  });

builder.queryField("ListSpans", (t) =>
  t.field({
    type: ListSpansResponseObject,
    args: {
      where: t.arg({
        type: ListSpansWhereInput,
        required: false,
      }),
    },
    resolve: async (root, args, context) => {
      const { spans } = await context.client.span.findMany({
        where: {
          ...(args.where?.spanIds ? { spanIds: args.where.spanIds } : {}),
        },
      });

      return {
        spans,
      };
    },
  }),
);
