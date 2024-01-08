import type {
  CreateTraceInput,
  CreateTraceResponse,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { TraceObject } from "../objects/trace";
import { builder } from "../schema";

const CreateTraceInputObject: InputRef<CreateTraceInput> = builder.inputType(
  "CreateTraceInput",
  {
    fields: (t) => ({
      traceId: t.string({
        required: true,
      }),
    }),
  },
);

const CreateTraceResponseObject: ObjectRef<CreateTraceResponse> =
  builder.objectType("CreateTraceResponse", {
    fields: (t) => ({
      trace: t.field({
        type: TraceObject,
        resolve: (root) => root.trace,
      }),
    }),
  });

builder.mutationField("createTrace", (t) =>
  t.field({
    type: CreateTraceResponseObject,
    args: {
      input: t.arg({
        type: CreateTraceInputObject,
        required: true,
      }),
    },
    resolve: async (root, args, context) => {
      const { trace } = await context.client.trace.createOne({
        input: args.input,
      });

      return {
        trace,
      };
    },
  }),
);
