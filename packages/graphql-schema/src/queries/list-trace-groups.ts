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
      traceIds: t.stringList({
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
    resolve: async (root, args, context) => {
      const traces = await context.client.trace.findMany({
        where: {
          id: args.where?.id,
          schemaId: args.where?.schemaId,
          rootSpanName: args.where?.rootSpanName,
          traceIds: args.where?.traceIds,
        },
        includeRootSpan: true,
        includeSpans: true,
      });

      return {
        traces,
      };
    },
  }),
);
