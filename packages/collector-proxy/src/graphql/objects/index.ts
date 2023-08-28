import { ListTraceGroupsResponse, ListTraceGroupsWhere } from '../queries/list-trace-groups';
import { Span } from './span';
import { Trace } from './trace';
import { Schema } from './schema';
import { ListSchemasResponse, ListSchemasWhere } from '../queries';

export interface Objects {
  Trace: Trace;
  Span: Span;
  Schema: Schema;
  ListSchemasWhere: ListSchemasWhere;
  ListSchemasResponse: ListSchemasResponse;
  ListTraceGroupsWhere: ListTraceGroupsWhere;
  ListTraceGroupsResponse: ListTraceGroupsResponse;
}
