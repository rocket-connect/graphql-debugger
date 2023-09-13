import {
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
} from "../queries/list-trace-groups";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  ListSchemasResponse,
  ListSchemasWhere,
} from "../queries";
import type { DeleteTracesResponse, DeleteTracesWhere } from "../mutations";
import { Span, Trace, Schema } from "@graphql-debugger/types";

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
