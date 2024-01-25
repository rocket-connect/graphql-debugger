import {
  DeleteSpanResponseSchema,
  DeleteSpanWhere,
  z,
} from "@graphql-debugger/schemas";

export type DeleteSpanWhere = z.infer<typeof DeleteSpanWhere>;
export type DeleteSpanResponse = z.infer<typeof DeleteSpanResponseSchema>;
