import { Span, Trace } from '../graphql-types';
import { useEffect, useState } from 'react';
import { listTraceGroups } from '../api/list-trace-groups';
import { useParams } from 'react-router-dom';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { parse, print } from 'graphql';

type RenderTree = Omit<Span, '__typename'> & {
  children: RenderTree[];
};

const ms = BigInt(1000000);

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
      startTimeUnixNano: span.startTimeUnixNano,
      endTimeUnixNano: span.endTimeUnixNano,
      durationNano: span.durationNano,
      parentSpanId: span.parentSpanId as string,
      createdAt: span.createdAt,
      kind: span.kind,
      id: span.id,
      updatedAt: span.updatedAt,
      errorMessage: span.errorMessage,
      errorStack: span.errorStack,
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

const Span = ({
  data,
  minTimestamp,
  maxTimestamp,
  selectedSpanId,
}: {
  data: RenderTree;
  minTimestamp: number;
  maxTimestamp: number;
  selectedSpanId?: string;
}) => {
  let width, offset;

  const calculatedWidth =
    (Number(BigInt(data.durationNano) / ms) / (maxTimestamp - minTimestamp)) * 100;
  width = calculatedWidth < 5 ? '5%' : `${calculatedWidth}%`;

  const calculatedOffset =
    ((Number(BigInt(data.startTimeUnixNano) / ms) - minTimestamp) / (maxTimestamp - minTimestamp)) *
    100;
  offset = calculatedOffset < 0 ? '0%' : `${calculatedOffset}%`;

  const isSelected = data.spanId === selectedSpanId;

  let spanClasses = 'absolute h-2';
  if (data.errorMessage) {
    spanClasses += ' bg-red-500';
  } else {
    spanClasses += ' bg-graphql-otel-green';
  }

  return (
    <div className="relative overflow-hidden flex flex-col gap-1">
      <div className="py-4">
        <div
          className={`absolute h-2 ${data.errorMessage ? '' : ''} ${
            isSelected ? 'bg-gray-200' : 'bg-graphql-otel-dark'
          } w-full`}
        ></div>
        <div className={spanClasses} style={{ width, left: offset }}></div>
      </div>

      <div className="text-white flex flex-col p-0 m-0">
        {Array.isArray(data.children)
          ? data.children.map((child) => (
              <Span
                key={child.id}
                data={child}
                minTimestamp={minTimestamp}
                maxTimestamp={maxTimestamp}
                selectedSpanId={selectedSpanId}
              />
            ))
          : null}
      </div>
    </div>
  );
};

const TraceView = ({ spans, selectedSpanId }: { spans: Span[]; selectedSpanId?: string }) => {
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

interface RenderUITree {
  id: string;
  name: string;
  children?: readonly RenderUITree[];
}

const convertSingleNodeToRenderUITree = (node: RenderTree): RenderUITree => {
  return {
    id: node.spanId,
    name: node.name,
    children: node.children ? node.children.map(convertSingleNodeToRenderUITree) : undefined,
  };
};

const convertToRenderUITree = (treeDataArray: RenderTree[]): RenderUITree[] => {
  return treeDataArray.map(convertSingleNodeToRenderUITree);
};

export default function RichObjectTreeView({
  spans,
  onSelect,
}: {
  spans: Span[];
  onSelect: (spanId: string) => void;
}) {
  const treeData = createTreeData(spans);
  const data = convertToRenderUITree(treeData);

  const renderTree = (node: RenderUITree) => {
    return (
      <TreeItem
        key={node.id}
        nodeId={node.id}
        label={<span onClick={() => onSelect(node.id)}>{node.name}</span>}
      >
        <div className="flex flex-col gap-6 pt-6">
          {Array.isArray(node.children) ? node.children.map((node) => renderTree(node)) : null}
        </div>
      </TreeItem>
    );
  };

  return (
    <div className="pt-1">
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <div className="flex flex-col gap-6">{data.map((node) => renderTree(node))}</div>
      </TreeView>
    </div>
  );
}

export function TraceViewer() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const params = useParams();
  const [selectedSpanId, setSelectedSpanId] = useState<string>();

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

  const rootSpan = traces[0]?.spans?.find((s) => !s.parentSpanId);

  return (
    <div className="flex gap-5 h-full">
      <div className="flex flex-1 flex-col">
        <div className="flex">
          <div className="w-2/3">
            <RichObjectTreeView
              spans={traces[0]?.spans || []}
              onSelect={(s) => setSelectedSpanId(s)}
            />
          </div>
          <div className="flex align-center justify-center w-1/3">
            <p className="my-auto">
              {rootSpan?.graphqlDocument && <pre>{print(parse(rootSpan.graphqlDocument))}</pre>}
            </p>
          </div>
        </div>

        <div>
          {traces?.length && (
            <TraceView spans={traces[0]?.spans || []} selectedSpanId={selectedSpanId} />
          )}
        </div>
      </div>
    </div>
  );
}
