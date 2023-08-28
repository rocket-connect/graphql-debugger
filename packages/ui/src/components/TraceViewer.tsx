import { Span, Trace } from '../graphql-types';
import { useEffect, useState } from 'react';
import { listTraceGroups } from '../api/list-trace-groups';
import { useParams } from 'react-router-dom';

type RenderTree = Omit<Span, '__typename'> & {
  children: RenderTree[];
};

const createTreeData = (spanArray: Span[]): RenderTree[] => {
  const treeData: RenderTree[] = [];
  const lookup: { [key: string]: RenderTree } = {};

  spanArray.forEach((span) => {
    lookup[span.spanId] = {
      spanId: span.spanId,
      name: span.name,
      traceId: span.traceId,
      attributes: span.attributes,
      children: [],
      timestamp: span.timestamp,
      duration: span.duration,
      parentSpanId: span.parentSpanId as string,
      createdAt: span.createdAt,
      kind: span.kind,
      endTimeUnixNano: span.endTimeUnixNano,
      startTimeUnixNano: span.startTimeUnixNano,
      id: span.id,
      updatedAt: span.updatedAt,
    };
  });

  spanArray.forEach((span) => {
    if (span.parentSpanId) {
      lookup[span.parentSpanId]?.children?.push(lookup[span.spanId]);
    } else {
      treeData.push(lookup[span.spanId]);
    }
  });

  return treeData;
};

const renderTree = (treeData, minTimestamp, maxTimestamp) => {
  let width = `${(treeData.duration / (maxTimestamp - minTimestamp)) * 100}%`;
  const widthNumber = parseFloat(width.split('%')[0]);
  if (widthNumber < 5) {
    width = '5%';
  }

  return (
    <div>
      <div className="flex items-center w-full">
        <div className="px-1">
          <div className="flex-none whitespace-nowrap overflow-hidden overflow-ellipsis text-graphql-otel-green text-lg px-4 py-2">
            {treeData.name}
          </div>

          <div className="relative flex-grow">
            <div
              className="absolute h-1 bg-graphql-otel-green"
              style={{
                width,
              }}
            ></div>
          </div>
        </div>
        {Array.isArray(treeData.children)
          ? treeData.children.map((child) => renderTree(child, minTimestamp, maxTimestamp))
          : null}
      </div>
    </div>
  );
};

const Span = ({
  data,
  minTimestamp,
  maxTimestamp,
  isTopLevel,
}: {
  data: RenderTree;
  minTimestamp: number;
  maxTimestamp: number;
  isTopLevel: boolean;
}) => {
  let width, offset;

  width = `${(data.duration / (maxTimestamp - minTimestamp)) * 100}%`;
  if (parseFloat(width.split('%')[0]) < 5) {
    width = '1%';
  }

  offset = `${((data.timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%`;

  return (
    <div className="relative overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col w-full my-1">
        <div className="flex-none text-white font-bold">{data.name}</div>
      </div>

      <div className="px-5">
        <div className="absolute h-3 bg-gray-300 w-full"></div>
        <div className="absolute h-3 bg-green-500" style={{ width, left: offset }}></div>
      </div>

      <div className="pt-5">
        <div className="flex flex-col">
          <div className="flex-none text-xs px-4 py-2">
            Duration: {data.duration.toFixed(12)} ms
          </div>
        </div>
      </div>
      <div className="text-white flex flex-col">
        {Array.isArray(data.children)
          ? data.children.map((child) => (
              <Span
                data={child}
                isTopLevel={false}
                minTimestamp={minTimestamp}
                maxTimestamp={maxTimestamp}
              />
            ))
          : null}
      </div>
    </div>
  );
};

const ControlledTreeView = ({ traces }) => {
  const treeData = createTreeData(traces);
  const minTimestamp = Math.min(...traces.map((t) => t.timestamp));
  const maxTimestamp = Math.max(...traces.map((t) => t.timestamp + t.duration));

  return (
    <div className="text-white flex flex-col">
      {treeData.map((treeItem) => (
        <Span
          isTopLevel={!treeItem.parentSpanId}
          key={treeItem.spanId}
          data={treeItem}
          minTimestamp={minTimestamp}
          maxTimestamp={maxTimestamp}
        />
      ))}
    </div>
  );
};

export function TraceViewer() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const params = useParams();

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
    <div className="flex gap-5">
      <div className="flex flex-1 flex-col overflow-scroll">
        {traces.map((t) => {
          return (
            <div key={t?.id}>
              <ControlledTreeView traces={t?.spans} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
