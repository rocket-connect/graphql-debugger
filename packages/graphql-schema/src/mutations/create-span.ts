import type {
  CreateSpanInput,
  CreateSpanResponse,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { SpanObject } from "../objects/span";
import { builder } from "../schema";

const CreateSpanInputObject: InputRef<CreateSpanInput> = builder.inputType(
  "CreateSpanInput",
  {
    fields: (t) => ({
      spanId: t.string({
        required: true,
      }),
      parentId: t.id({
        required: true,
      }),
      name: t.string({
        required: true,
      }),
      kind: t.int({
        required: true,
      }),
      startTimeUnixNano: t.string({
        required: true,
      }),
      endTimeUnixNano: t.string({
        required: true,
      }),
      traceId: t.string({
        required: true,
      }),
      traceGroupId: t.string({
        required: true,
      }),
      errorMessage: t.string({
        required: false,
      }),
      errorStack: t.string({
        required: false,
      }),
      graphqlDocument: t.string({
        required: false,
      }),
      graphqlVariables: t.string({
        required: false,
      }),
      graphqlResult: t.string({
        required: false,
      }),
      graphqlContext: t.string({
        required: false,
      }),
      graphqlSchemaHash: t.string({
        required: false,
      }),
      graphqlOperationName: t.string({
        required: false,
      }),
      graphqlOperationType: t.string({
        required: false,
      }),
      isForeign: t.boolean({
        required: true,
      }),
      isGraphQLRootSpan: t.boolean({
        required: false,
      }),
      attributes: t.string({
        required: false,
      }),
    }),
  },
);

const CreateSpanResponseObject: ObjectRef<CreateSpanResponse> =
  builder.objectType("CreateSpanResponse", {
    fields: (t) => ({
      span: t.field({
        type: SpanObject,
        resolve: (root) => root.span,
      }),
    }),
  });

builder.mutationField("createSpan", (t) =>
  t.field({
    type: CreateSpanResponseObject,
    args: {
      input: t.arg({
        type: CreateSpanInputObject,
        required: true,
      }),
    },
    resolve: async (root, args, context) => {
      const { span } = await context.client.span.createOne({
        input: args.input,
      });

      return {
        span,
      };
    },
  }),
);
