import { prisma } from "@graphql-debugger/data-access";
import { TimeStamp, UnixNanoTimeStamp } from "@graphql-debugger/time";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
} from "@graphql-debugger/types";

import { InputRef, ObjectRef } from "@pothos/core";

import { SpanObject } from "../objects/span";
import { builder } from "../schema";

const AggregateSpansWhereInput: InputRef<AggregateSpansWhere> =
  builder.inputType("AggregateSpansWhere", {
    fields: (t) => ({
      schemaId: t.string({
        required: true,
      }),
      name: t.string({
        required: true,
      }),
    }),
  });

const AggregateSpansResponseObject: ObjectRef<AggregateSpansResponse> =
  builder.objectType("AggregateSpansResponse", {
    fields: (t) => ({
      resolveCount: t.field({
        type: "Int",
        resolve: (root) => root.spans.length,
      }),
      errorCount: t.field({
        type: "Int",
        resolve: (root) => {
          return root.spans.filter((s) => s.errorMessage || s.errorStack)
            .length;
        },
      }),
      averageDuration: t.field({
        type: "String",
        resolve: (root) => {
          if (root.spans.length === 0) {
            return "0";
          }

          const durations = root.spans.map(
            (s) => new UnixNanoTimeStamp(BigInt(s.durationNano)),
          );

          const average = UnixNanoTimeStamp.average(durations);

          return average.toString();
        },
      }),
      lastResolved: t.field({
        type: "String",
        resolve: (root) => {
          if (root.spans.length === 0) {
            return "0";
          }

          const timestamps = root.spans.map(
            (s) => new UnixNanoTimeStamp(BigInt(s.endTimeUnixNano)),
          );

          const max = UnixNanoTimeStamp.latest(timestamps);

          return max.toString();
        },
      }),
      spans: t.field({
        type: [SpanObject],
        resolve: (root) => root.spans,
      }),
    }),
  });

builder.queryField("aggregateSpans", (t) =>
  t.field({
    type: AggregateSpansResponseObject,
    args: {
      where: t.arg({
        type: AggregateSpansWhereInput,
        required: true,
      }),
    },
    resolve: async (root, args) => {
      const spans = await prisma.span.findMany({
        where: {
          traceGroup: {
            schemaId: args.where.schemaId,
          },
          name: args.where.name,
        },
      });

      return {
        resolveCount: 0,
        errorCount: 0,
        averageDuration: "0",
        lastResolved: "0",
        spans: spans.map((span) => {
          return {
            id: span.id,
            spanId: span.spanId,
            parentSpanId: span.parentSpanId as string,
            traceId: span.traceId,
            name: span.name as string,
            kind: span.kind,
            startTimeUnixNano: new UnixNanoTimeStamp(
              span.startTimeUnixNano,
            ).toString(),
            endTimeUnixNano: new UnixNanoTimeStamp(
              span.endTimeUnixNano,
            ).toString(),
            durationNano: new UnixNanoTimeStamp(span.durationNano).toString(),
            graphqlDocument: span.graphqlDocument,
            graphqlVariables: span.graphqlVariables,
            graphqlResult: span.graphqlResult,
            graphqlContext: span.graphqlContext,
            timestamp: 0,
            createdAt: new TimeStamp(span.createdAt).toString(),
            updatedAt: new TimeStamp(span.updatedAt).toString(),
            errorMessage: span.errorMessage,
            errorStack: span.errorStack,
            isForeign: span.isForeign,
            attributes: span.attributes as string,
          };
        }),
      };
    },
  }),
);
