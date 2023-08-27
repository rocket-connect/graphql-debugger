import { ListTraceGroupsResponse } from '../queries/list-trace-groups';
import { Span } from './span';
import { Trace } from './trace';

export interface Objects {
  Trace: Trace;
  Span: Span;
  ListTraceGroupsResponse: ListTraceGroupsResponse;
}
