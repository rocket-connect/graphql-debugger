import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  DeleteTracesResponse,
  DeleteTracesWhere,
  ListSchemasResponse,
  ListSchemasWhere,
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
  Schema,
  Span,
  Trace,
} from "@graphql-debugger/types";

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
