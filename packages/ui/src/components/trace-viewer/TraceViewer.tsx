import { useEffect, useState } from 'react';
import { listTraceGroups } from '../../api/list-trace-groups';
import { useParams } from 'react-router-dom';
import { Span } from './Span';
import { createTreeData, ms } from './utils';
import { Span as TSpan, Trace } from '../../graphql-types';

const TraceView = ({ spans, selectedSpanId }: { spans: TSpan[]; selectedSpanId?: string }) => {
  const treeData = createTreeData(spans);
  const minTimestamp = Math.min(...spans.map((t) => Number(BigInt(t.startTimeUnixNano) / ms)));
  const maxTimestamp = Math.max(...spans.map((t) => Number(BigInt(t.endTimeUnixNano) / ms)));

  return (
    <div className="text-white flex flex-col">
      {treeData.map((treeItem) => (
        <Span
          key={treeItem.spanId}
          data={treeItem}
          minTimestamp={minTimestamp}
          maxTimestamp={maxTimestamp}
          selectedSpanId={selectedSpanId}
        />
      ))}
    </div>
  );
};

export function TraceViewer() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const params = useParams();
  const [selectedSpanId] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        if (params.traceId) {
          const _traces = await listTraceGroups({
            where: {
              id: params.traceId,
            },
            includeSpans: true,
          });
          setTraces(_traces);
        }
      } catch (error) {
        console.error(error);
        setTraces([]);
      }
    })();
  }, [params.traceId]);

  return (
    <div>
      {traces?.length && (
        <TraceView spans={traces[0]?.spans || []} selectedSpanId={selectedSpanId} />
      )}
    </div>
  );
}
