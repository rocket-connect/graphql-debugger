import { prisma } from "@graphql-debugger/data-access";
import { Trace } from "@graphql-debugger/types";

import { ObjectRef } from "@pothos/core";

import { TraceObject } from "../objects/trace";
import { builder } from "../schema";

export type ListTraceGroupsResponse = {
  traces: Trace[];
};

export type ListTraceGroupsWhere = {
  id?: string;
  schemaId?: string;
  rootSpanName?: string;
};

export const ListTraceGroupsWhere = builder.inputType("ListTraceGroupsWhere", {
  fields: (t) => ({
    id: t.string({
      required: false,
    }),
    schemaId: t.string({
      required: false,
    }),
    rootSpanName: t.string({
      required: false,
    }),
  }),
});

export const ListTraceGroupsResponse: ObjectRef<ListTraceGroupsResponse> =
  builder.objectType("ListTraceGroupsResponse", {
    fields: (t) => ({
      traces: t.expose("traces", {
        type: [TraceObject],
      }),
    }),
  });

builder.queryField("listTraceGroups", (t) =>
  t.field({
    type: ListTraceGroupsResponse,
    args: {
      where: t.arg({
        type: ListTraceGroupsWhere,
        required: false,
      }),
    },
    resolve: async (root, args) => {
      const where = {
        ...(args.where?.id ? { id: args.where.id } : {}),
        ...(args.where?.schemaId ? { schemaId: args.where.schemaId } : {}),
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

      const traces = await prisma.traceGroup.findMany({
        orderBy: { createdAt: "desc" },
        where,
        take: 20,
      });

      return {
        traces: traces.map((trace) => {
          return {
            id: trace.id,
            traceId: trace.traceId,
            spans: [],
          };
        }),
      };
    },
  }),
);
