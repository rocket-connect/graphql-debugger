import { ObjectRef } from "@pothos/core";
import { builder } from "../schema";
import { Span } from "@graphql-debugger/types";

export const SpanObject: ObjectRef<Span> = builder.objectType("Span", {
  fields: (t) => ({
    id: t.exposeString("id"),
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
