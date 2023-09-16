import { prisma } from "@graphql-debugger/data-access";
import {
  DeleteTracesResponse,
  DeleteTracesWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { builder } from "../schema";

const DeleteTracesWhereInput: InputRef<DeleteTracesWhere> = builder.inputType(
  "DeleteTracesWhere",
  {
    fields: (t) => ({
      schemaId: t.string({
        required: true,
      }),
      rootSpanName: t.string({
        required: false,
      }),
    }),
  },
);

const DeleteTracesResponseObject: ObjectRef<DeleteTracesResponse> =
  builder.objectType("DeleteTracesResponse", {
    fields: (t) => ({
      success: t.exposeBoolean("success"),
    }),
  });

builder.mutationField("deleteTraces", (t) =>
  t.field({
    type: DeleteTracesResponseObject,
    args: {
      where: t.arg({
        type: DeleteTracesWhereInput,
        required: true,
      }),
    },
    resolve: async (root, args) => {
      const where = {
        schemaId: args.where.schemaId,
        ...(args.where?.rootSpanName
          ? {
              spans: {
                some: {
                  parentSpanId: null,
                  name: {
                    equals: args.where?.rootSpanName,
                  },
                },
              },
            }
          : {}),
      };

      await prisma.traceGroup.deleteMany({
        where,
      });

      return {
        success: true,
      };
    },
  }),
);
