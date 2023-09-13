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
    durationNano: t.exposeString("durationNano"),
    startTimeUnixNano: t.exposeString("startTimeUnixNano"),
    endTimeUnixNano: t.exposeString("endTimeUnixNano"),
    graphqlDocument: t.exposeString("graphqlDocument", { nullable: true }),
    graphqlVariables: t.exposeString("graphqlVariables", { nullable: true }),
    graphqlResult: t.exposeString("graphqlResult", { nullable: true }),
    graphqlContext: t.exposeString("graphqlContext", { nullable: true }),
    errorMessage: t.exposeString("errorMessage", { nullable: true }),
    errorStack: t.exposeString("errorStack", { nullable: true }),
    createdAt: t.exposeString("createdAt"),
    updatedAt: t.exposeString("updatedAt"),
  }),
});
