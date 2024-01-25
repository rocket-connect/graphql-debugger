import type {
  UpdateTraceInput,
  UpdateTraceResponse,
  UpdateTraceWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { TraceObject } from "../objects/trace";
import { builder } from "../schema";

const UpdateTraceInputObject: InputRef<UpdateTraceInput> = builder.inputType(
  "UpdateTraceInput",
  {
    fields: (t) => ({
      schemaId: t.string({
        required: true,
      }),
    }),
  },
);
const UpdateTraceWhereObject: InputRef<UpdateTraceWhere> = builder.inputType(
  "UpdateTraceWhere",
  {
    fields: (t) => ({
      id: t.string({
        required: true,
      }),
    }),
  },
);

const UpdateTraceResponseObject: ObjectRef<UpdateTraceResponse> =
  builder.objectType("UpdateTraceResponse", {
    fields: (t) => ({
      trace: t.field({
        type: TraceObject,
        resolve: (root) => root.trace,
      }),
    }),
  });

builder.mutationField("updateTrace", (t) =>
  t.field({
    type: UpdateTraceResponseObject,
    args: {
      where: t.arg({
        type: UpdateTraceWhereObject,
        required: true,
      }),
      input: t.arg({
        type: UpdateTraceInputObject,
        required: true,
      }),
    },
    resolve: async (root, args, context) => {
      const { trace } = await context.client.trace.updateOne({
        where: args.where,
        input: args.input,
      });

      return {
        trace,
      };
    },
  }),
);
