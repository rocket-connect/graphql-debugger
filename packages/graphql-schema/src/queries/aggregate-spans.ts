import {
  AggregateSpansResponse,
  AggregateSpansWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { builder } from "../schema";

const AggregateSpansWhereInput: InputRef<AggregateSpansWhere> =
  builder.inputType("AggregateSpansWhere", {
    fields: (t) => ({
      schemaId: t.string({
        required: true,
      }),
      name: t.string({
        required: true,
      }),
    }),
  });

const AggregateSpansResponseObject: ObjectRef<AggregateSpansResponse> =
  builder.objectType("AggregateSpansResponse", {
    fields: (t) => ({
      resolveCount: t.field({
        type: "Int",
        resolve: (root) => root.resolveCount,
      }),
      errorCount: t.field({
        type: "Int",
        resolve: (root) => root.errorCount,
      }),
      averageDuration: t.field({
        type: "String",
        resolve: (root) => root.averageDuration,
      }),
      lastResolved: t.field({
        type: "String",
        resolve: (root) => root.lastResolved,
      }),
    }),
  });

builder.queryField("aggregateSpans", (t) =>
  t.field({
    type: AggregateSpansResponseObject,
    args: {
      where: t.arg({
        type: AggregateSpansWhereInput,
        required: true,
      }),
    },
    resolve: async (root, args, context) => {
      const aggregate = await context.client.span.aggregate({
        where: {
          schemaId: args.where.schemaId,
          name: args.where.name,
        },
      });

      return aggregate;
    },
  }),
);
