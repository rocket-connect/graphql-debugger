import { Span } from "@graphql-debugger/types";

import { ObjectRef } from "@pothos/core";

import { builder } from "../schema";

export const SpanObject: ObjectRef<Span> = builder.objectType("Span", {
  fields: (t) => ({
    id: t.exposeString("id"),
    spanId: t.exposeString("spanId"),
    parentSpanId: t.exposeString("parentSpanId", { nullable: true }),
    traceId: t.exposeString("traceId"),
    name: t.exposeString("name"),
    kind: t.exposeString("kind"),
    isForeign: t.exposeBoolean("isForeign"),
    attributes: t.exposeString("attributes", { nullable: true }),
    durationNano: t.exposeString("durationNano"),
    startTimeUnixNano: t.exposeString("startTimeUnixNano"),
    endTimeUnixNano: t.exposeString("endTimeUnixNano"),
    graphqlDocument: t.exposeString("graphqlDocument", { nullable: true }),
    graphqlOperationName: t.exposeString("graphqlOperationName", {
      nullable: true,
    }),
    graphqlOperationType: t.exposeString("graphqlOperationType", {
      nullable: true,
    }),
    graphqlSchemaHash: t.exposeString("graphqlSchemaHash", { nullable: true }),
    errorMessage: t.exposeString("errorMessage", { nullable: true }),
    errorStack: t.exposeString("errorStack", { nullable: true }),
    createdAt: t.exposeString("createdAt"),
    updatedAt: t.exposeString("updatedAt"),
    isGraphQLRootSpan: t.exposeBoolean("isGraphQLRootSpan", { nullable: true }),
  }),
});
