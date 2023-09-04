import {
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
} from "../queries/list-trace-groups";
import { Span } from "./span";
import { Trace } from "./trace";
import { Schema } from "./schema";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  ListSchemasResponse,
  ListSchemasWhere,
} from "../queries";
import {
  DeleteTracesResponse,
  DeleteTracesWhere,
} from "../mutations/delete-traces";

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
