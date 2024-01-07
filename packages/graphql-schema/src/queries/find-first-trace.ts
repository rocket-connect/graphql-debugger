import {
  FindFirstTraceResponse,
  FindFirstTraceWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { TraceObject } from "../objects/trace";
import { builder } from "../schema";

const FindFirstTraceWhereInput: InputRef<FindFirstTraceWhere> =
  builder.inputType("FindFirstTraceWhere", {
    fields: (t) => ({
      traceId: t.string({
        required: true,
      }),
    }),
  });

const FindFirstTraceResponseObject: ObjectRef<FindFirstTraceResponse> =
  builder.objectType("FindFirstTraceResponse", {
    fields: (t) => ({
      trace: t.field({
        type: TraceObject,
        nullable: true,
        resolve: (root) => root.trace,
      }),
    }),
  });

builder.queryField("FindFirstTrace", (t) =>
  t.field({
    type: FindFirstTraceResponseObject,
    args: {
      where: t.arg({
        type: FindFirstTraceWhereInput,
        required: true,
      }),
    },
    resolve: async (root, args, context) => {
      const trace = await context.client.trace.findFirst({
        where: {
          traceId: args.where.traceId,
        },
      });

      return {
        trace,
      };
    },
  }),
);
