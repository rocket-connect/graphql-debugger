import { Schema } from "@graphql-debugger/types";

import { ObjectRef } from "@pothos/core";

import { builder } from "../schema";
import { TraceObject } from "./trace";

export const SchemaObject: ObjectRef<Schema> = builder.objectType("Schema", {
  fields: (t) => ({
    id: t.exposeID("id"),
    hash: t.exposeString("hash"),
    name: t.exposeString("name", { nullable: true }),
    typeDefs: t.exposeString("typeDefs"),
    createdAt: t.exposeString("createdAt"),
    traceGroups: t.field({
      type: [TraceObject],
      resolve: async (root, args, context) => {
        const traceGroups = await context.client.trace.findMany({
          where: {
            schemaId: root.id,
          },
        });

        return traceGroups;
      },
    }),
  }),
});
