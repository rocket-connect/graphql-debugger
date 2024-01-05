import { prisma } from "@graphql-debugger/data-access";
import {
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { TraceObject } from "../objects/trace";
import { builder } from "../schema";

const ListTraceGroupsWhereInput: InputRef<ListTraceGroupsWhere> =
  builder.inputType("ListTraceGroupsWhere", {
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

const ListTraceGroupsResponseObject: ObjectRef<ListTraceGroupsResponse> =
  builder.objectType("ListTraceGroupsResponse", {
    fields: (t) => ({
      traces: t.expose("traces", {
        type: [TraceObject],
      }),
    }),
  });

builder.queryField("listTraceGroups", (t) =>
  t.field({
    type: ListTraceGroupsResponseObject,
    args: {
      where: t.arg({
        type: ListTraceGroupsWhereInput,
        required: false,
      }),
    },
    resolve: async (root, args) => {
      const whereConditions: any = [
        {
          spans: {
            some: {
              isGraphQLRootSpan: true,
            },
          },
        },
      ];

      if (args.where?.id) {
        whereConditions.push({ id: args.where.id });
      }

      if (args.where?.schemaId) {
        whereConditions.push({ schemaId: args.where.schemaId });
      }

      if (args.where?.rootSpanName) {
        whereConditions.push({
          spans: {
            some: {
              name: {
                equals: args.where.rootSpanName,
              },
            },
          },
        });
      }

      const where = {
        AND: whereConditions,
      };

      // TODO - unify client reads
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
