import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { Span, Trace } from "@graphql-debugger/types";

import { ObjectRef } from "@pothos/core";

import { builder } from "../schema";
import { SpanObject } from "./span";

export const TraceObject: ObjectRef<Trace> = builder.objectType("Trace", {
  fields: (t) => ({
    id: t.exposeString("id"),
    traceId: t.exposeString("traceId"),
    rootSpan: t.field({
      type: SpanObject,
      nullable: true,
      resolve: async (root, args, context) => {
        if (root.rootSpan) {
          return root.rootSpan;
        }

        const span = await context.loaders.rootSpanLoader.load(root.id);

        return span;
      },
    }),
    firstSpanErrorMessage: t.field({
      type: "String",
      nullable: true,
      resolve: async (root, args, context) => {
        const spans = await context.loaders.spanLoader.load(root.id);

        return spans.find((span) => span.errorMessage !== null)?.errorMessage;
      },
    }),
    firstSpanErrorStack: t.field({
      type: "String",
      nullable: true,
      resolve: async (root, args, context) => {
        const spans = await context.loaders.spanLoader.load(root.id);

        return spans.find((span) => span.errorMessage !== null)?.errorMessage;
      },
    }),
    spans: t.field({
      type: [SpanObject],
      resolve: async (root, args, context) => {
        if (root.spans?.length) {
          return root.spans;
        }

        const spans = await context.loaders.spanLoader.load(root.id);

        return spans.reduce<Span[]>((list, span) => {
          // collapse duplicate spans and add together, this is for graphql field resolvers and n+1
          const groupSpan = list.find(
            (s) => s.name === span.name && s.parentSpanId === span.parentSpanId,
          );

          if (groupSpan) {
            const spanStartTime = UnixNanoTimeStamp.fromString(
              span.startTimeUnixNano,
            );
            const spanEndTime = UnixNanoTimeStamp.fromString(
              span.endTimeUnixNano,
            );

            const groupSpanStartTime = UnixNanoTimeStamp.fromString(
              groupSpan.startTimeUnixNano,
            );
            const groupSpanEndTime = UnixNanoTimeStamp.fromString(
              groupSpan.endTimeUnixNano,
            );

            groupSpan.startTimeUnixNano =
              groupSpanStartTime.getBigInt() > spanStartTime.getBigInt()
                ? spanStartTime.toString()
                : groupSpanStartTime.toString();

            groupSpan.endTimeUnixNano =
              groupSpanEndTime.getBigInt() < spanEndTime.getBigInt()
                ? spanEndTime.toString()
                : groupSpanEndTime.toString();

            return list;
          } else {
            return [...list, span];
          }
        }, []);
      },
    }),
  }),
});
