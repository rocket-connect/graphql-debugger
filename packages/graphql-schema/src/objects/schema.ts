import { prisma } from "@graphql-debugger/data-access";
import { ObjectRef } from "@graphql-debugger/utils";
import { builder } from "../schema";
import { TraceObject } from "./trace";
import { Schema } from "@graphql-debugger/types";

export const SchemaObject: ObjectRef<Schema> = builder.objectType("Schema", {
  fields: (t) => ({
    id: t.exposeID("id"),
    hash: t.exposeString("hash"),
    name: t.exposeString("name", { nullable: true }),
    typeDefs: t.exposeString("typeDefs"),
    createdAt: t.exposeString("createdAt"),
    traceGroups: t.field({
      type: [TraceObject],
      resolve: async (root) => {
        const traceGroups = await prisma.traceGroup.findMany({
          where: {
            schemaId: root.id,
          },
        });

        return traceGroups.map((traceGroup) => ({
          id: traceGroup.id,
          traceId: traceGroup.traceId,
          spans: [],
        }));
      },
    }),
  }),
});
