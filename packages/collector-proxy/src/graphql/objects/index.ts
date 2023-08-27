import { ListTraceGroupsResponse } from '../queries/list-trace-groups';
import { Span } from './span';
import { Trace } from './trace';
import { Schema } from './schema';
import { ListSchemasResponse } from '../queries';

export interface Objects {
  Trace: Trace;
  Span: Span;
  Schema: Schema;
  ListSchemasResponse: ListSchemasResponse;
  ListTraceGroupsResponse: ListTraceGroupsResponse;
}
