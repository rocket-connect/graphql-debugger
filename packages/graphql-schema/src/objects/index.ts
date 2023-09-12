import {
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
} from "../queries/list-trace-groups";
import { Trace } from "./trace";
import { Schema } from "./schema";
import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  ListSchemasResponse,
  ListSchemasWhere,
} from "../queries";
import type { DeleteTracesResponse, DeleteTracesWhere } from "../mutations";
import { Span } from "@graphql-debugger/types";

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
