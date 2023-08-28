import { Span, Trace } from '../graphql-types';
import { useEffect, useState } from 'react';
import { listTraceGroups } from '../api/list-trace-groups';
import { useParams } from 'react-router-dom';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

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

  // Sort the children so that leaf nodes come before non-leaf nodes.
  const sortChildren = (node: RenderTree) => {
    if (node.children.length > 0) {
      node.children.forEach(sortChildren);
      node.children.sort((a, b) => a.timestamp - b.timestamp);
    }
  };

  treeData.forEach(sortChildren);

  return treeData;
};

const renderTree = (treeData, minTimestamp, maxTimestamp) => {
  let width = `${(treeData.duration / (maxTimestamp - minTimestamp)) * 100}%`;
  const widthNumber = parseFloat(width.split('%')[0]);
  if (widthNumber < 5) {
    width = '2%';
  }

  return (
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
  );
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

  const calculatedWidth = (data.duration / (maxTimestamp - minTimestamp)) * 100;
  width = calculatedWidth < 5 ? '5%' : `${calculatedWidth}%`;

  const calculatedOffset = ((data.timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * 100;
  offset = calculatedOffset < 0 ? '0%' : `${calculatedOffset}%`;

  const isSelected = data.spanId === selectedSpanId;

  return (
    <div className="relative overflow-hidden flex flex-col gap-5">
      <div className="flex flex-col w-full">
        <div
          className={`flex-none text-white ${
            isSelected ? 'underline decoration-green-500 font-bold text-lg' : ''
          }`}
        >
          {data.name}
        </div>
      </div>

      <div>
        <div className="absolute h-3 bg-gray-300 w-full"></div>
        <div className="absolute h-3 bg-green-500" style={{ width, left: offset }}></div>
      </div>

      <div className="text-white flex flex-col p-0 m-0">
        {Array.isArray(data.children)
          ? data.children
              .sort((a, b) => a.children.length - b.children.length)
              .map((child) => (
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
  const minTimestamp = Math.min(...spans.map((t) => t.timestamp));
  const maxTimestamp = Math.max(...spans.map((t) => t.timestamp + t.duration));

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
        <div className="flex flex-col gap-8 pt-8">
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
        <div className="flex flex-col gap-8">{data.map((node) => renderTree(node))}</div>
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

  return (
    <div className="flex gap-5">
      <div className="flex flex-1 flex-row overflow-scroll">
        <div className="w-1/3">
          <RichObjectTreeView
            spans={traces[0]?.spans || []}
            onSelect={(s) => setSelectedSpanId(s)}
          />
        </div>

        <div className="w-2/3">
          {traces?.length && (
            <TraceView spans={traces[0]?.spans || []} selectedSpanId={selectedSpanId} />
          )}
        </div>
      </div>
    </div>
  );
}
