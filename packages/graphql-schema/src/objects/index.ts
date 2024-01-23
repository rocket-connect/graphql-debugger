import {
  AggregateSpansResponse,
  AggregateSpansWhere,
  ClearDBResponse,
  CreateSpanInput,
  CreateSpanResponse,
  CreateTraceInput,
  CreateTraceResponse,
  DeleteSpanResponse,
  DeleteSpanWhere,
  FindFirstSchemaResponse,
  FindFirstSchemaWhere,
  FindFirstTraceResponse,
  FindFirstTraceWhere,
  ListSchemasResponse,
  ListSchemasWhere,
  ListSpansResponse,
  ListSpansWhere,
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
  Schema,
  Span,
  Trace,
  UpdateTraceInput,
  UpdateTraceResponse,
  UpdateTraceWhere,
  UpsertSchemaInput,
  UpsertSchemaResponse,
  UpsertSchemaWhere,
} from "@graphql-debugger/types";

export interface Objects {
  Trace: Trace;
  Span: Span;
  Schema: Schema;
  ListSchemasWhere: ListSchemasWhere;
  ListSchemasResponse: ListSchemasResponse;
  ListSpansResponse: ListSpansResponse;
  ListSpansWhere: ListSpansWhere;
  ListTraceGroupsWhere: ListTraceGroupsWhere;
  ListTraceGroupsResponse: ListTraceGroupsResponse;
  AggregateSpansWhere: AggregateSpansWhere;
  AggregateSpansResponse: AggregateSpansResponse;
  FindFirstSchemaResponse: FindFirstSchemaResponse;
  FindFirstSchemaWhere: FindFirstSchemaWhere;
  FindFirstTraceResponse: FindFirstTraceResponse;
  FindFirstTraceWhere: FindFirstTraceWhere;
  CreateSpanInput: CreateSpanInput;
  CreateSpanResponse: CreateSpanResponse;
  CreateTraceInput: CreateTraceInput;
  CreateTraceResponse: CreateTraceResponse;
  UpdateTraceInput: UpdateTraceInput;
  UpdateTraceResponse: UpdateTraceResponse;
  UpdateTraceWhere: UpdateTraceWhere;
  UpsertSchemaInput: UpsertSchemaInput;
  UpsertSchemaResponse: UpsertSchemaResponse;
  UpsertSchemaWhere: UpsertSchemaWhere;
  ClearDBResponse: ClearDBResponse;
  DeleteSpanResponse: DeleteSpanResponse;
  DeleteSpanWhere: DeleteSpanWhere;
}
