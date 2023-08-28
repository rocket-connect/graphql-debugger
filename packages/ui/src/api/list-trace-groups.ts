import { Query, Trace } from '../graphql-types';
import { api } from './api';

const ListTraceGroups = /* GraphQL */ `
  query {
    listTraceGroups {
      traces {
        id
        traceId
        spans {
          ...SpanObject
        }
      }
    }
  }

  fragment SpanObject on Span {
    id
    spanId
    traceId
    parentSpanId
    name
    kind
    attributes
    duration
    timestamp
  }
`;

export async function listTraceGroups(): Promise<Trace[]> {
  const { data, errors } = await api<{ listTraceGroups: Query['listTraceGroups'] }>({
    query: ListTraceGroups,
  });

  if (errors && errors?.length > 0) {
    throw new Error(errors.map((e) => e.message).join('\n'));
  }

  return data.listTraceGroups.traces;
}
