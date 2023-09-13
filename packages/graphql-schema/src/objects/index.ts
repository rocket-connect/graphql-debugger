import { Schema, Span, Trace } from "@graphql-debugger/types";

import type { DeleteTracesResponse, DeleteTracesWhere } from "../mutations";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  ListSchemasResponse,
  ListSchemasWhere,
} from "../queries";
import {
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
} from "../queries/list-trace-groups";

export interface Objects {
  Trace: Trace;
  Span: Span;
  Schema: Schema;
  ListSchemasWhere: ListSchemasWhere;
  ListSchemasResponse: ListSchemasResponse;
  ListTraceGroupsWhere: ListTraceGroupsWhere;
  ListTraceGroupsResponse: ListTraceGroupsResponse;
  AggregateSpansWhere: AggregateSpansWhere;
  AggregateSpansResponse: AggregateSpansResponse;
  DeleteTracesWhere: DeleteTracesWhere;
  DeleteTracesResponse: DeleteTracesResponse;
}
