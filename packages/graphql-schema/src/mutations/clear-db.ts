import type { ClearDBResponse } from "@graphql-debugger/types";

import { ObjectRef } from "@pothos/core";

import { builder } from "../schema";

const ClearDBResponseObject: ObjectRef<ClearDBResponse> = builder.objectType(
  "ClearDBResponse",
  {
    fields: (t) => ({
      success: t.boolean({
        resolve: (root) => root.success,
      }),
    }),
  },
);

// TODO this should be used for testing only
builder.mutationField("clearDB", (t) =>
  t.field({
    type: ClearDBResponseObject,
    resolve: async (root, args, context) => {
      await context.client.adapter.clearDB();

      return {
        success: true,
      };
    },
  }),
);
