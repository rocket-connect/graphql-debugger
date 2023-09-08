import type { Span as PrismaSpan } from "@graphql-debugger/data-access";
import { ObjectRef } from "@pothos/core";
import { TimeStamp, UnixNanoTimeStamp } from "@graphql-debugger/time";
import { builder } from "../schema";

export type Span = {
  id: PrismaSpan["id"];
  spanId: PrismaSpan["spanId"];
  parentSpanId: PrismaSpan["parentSpanId"];
  traceId: PrismaSpan["traceId"];
  name: PrismaSpan["name"];
  kind: PrismaSpan["kind"];
  durationNano: UnixNanoTimeStamp;
  startTimeUnixNano: UnixNanoTimeStamp;
  endTimeUnixNano: UnixNanoTimeStamp;
  errorMessage?: PrismaSpan["errorMessage"];
  errorStack?: PrismaSpan["errorStack"];
  graphqlDocument?: PrismaSpan["graphqlDocument"];
  graphqlVariables?: PrismaSpan["graphqlVariables"];
  graphqlResult?: PrismaSpan["graphqlResult"];
  graphqlContext?: PrismaSpan["graphqlContext"];
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
};

export const SpanObject: ObjectRef<Span> = builder.objectType("Span", {
  fields: (t) => ({
    id: t.exposeID("id"),
    spanId: t.exposeString("spanId"),
    parentSpanId: t.exposeString("parentSpanId", { nullable: true }),
    traceId: t.exposeString("traceId"),
    name: t.exposeString("name"),
    kind: t.exposeString("kind"),
    durationNano: t.field({
      type: "String",
      resolve: (root) => {
        return root.durationNano.toString();
      },
    }),
    startTimeUnixNano: t.field({
      type: "String",
      resolve: (root) => {
        return root.startTimeUnixNano.toString();
      },
    }),
    endTimeUnixNano: t.field({
      type: "String",
      resolve: (root) => {
        return root.endTimeUnixNano.toString();
      },
    }),
    graphqlDocument: t.exposeString("graphqlDocument", { nullable: true }),
    graphqlVariables: t.exposeString("graphqlVariables", { nullable: true }),
    graphqlResult: t.exposeString("graphqlResult", { nullable: true }),
    graphqlContext: t.exposeString("graphqlContext", { nullable: true }),
    errorMessage: t.exposeString("errorMessage", { nullable: true }),
    errorStack: t.exposeString("errorStack", { nullable: true }),
    createdAt: t.field({
      type: "String",
      resolve: (root) => {
        return root.createdAt.toString();
      },
    }),
    updatedAt: t.field({
      type: "String",
      resolve: (root) => {
        return root.updatedAt.toString();
      },
    }),
  }),
});
