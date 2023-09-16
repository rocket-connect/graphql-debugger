import {
  DeleteTracesResponseSchema,
  DeleteTracesWhereSchema,
  z,
} from "@graphql-debugger/schemas";

export type DeleteTracesResponse = z.infer<typeof DeleteTracesResponseSchema>;
export type DeleteTracesWhere = z.infer<typeof DeleteTracesWhereSchema>;
