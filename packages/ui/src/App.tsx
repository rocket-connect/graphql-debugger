import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import 'tailwindcss/tailwind.css';
import { gql, useQuery } from 'urql';
import { Query, Span } from './graphql-types';

const ListTraceGroups = gql`
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
  const left = `${((treeData.timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%`;

  let width = `${(treeData.duration / (maxTimestamp - minTimestamp)) * 100}%`;
  const widthNumber = parseFloat(width.split('%')[0]);
  if (widthNumber < 5) {
    width = '5%';
  }

  return (
    <div>
      <div className="flex items-center w-full">
        <div className="flex-none whitespace-nowrap overflow-hidden overflow-ellipsis text-graphql-otel-green text-lg px-4 py-2">
          {treeData.name}
        </div>

        <div className="relative flex-grow">
          <div
            className="absolute h-1 bg-graphql-otel-green"
            style={{
              left,
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

const Span = ({ data, minTimestamp, maxTimestamp, isTopLevel }) => {
  let left, width;

  if (isTopLevel) {
    left = '0%';
    width = '100%';
  } else {
    left = `${((data.timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%`;
    width = `${(data.duration / (maxTimestamp - minTimestamp)) * 100}%`;
    if (parseFloat(width.split('%')[0]) < 5) {
      width = '3%';
    }
  }

  if (parseFloat(left.split('%')[0]) > 99) {
    left = '98%';
  }

  return (
    <div className="relative">
      <div className="absolute h-3 bg-gray-300 w-full"></div>
      <div className="absolute h-3 bg-green-500" style={{ left, width }}></div>

      <div className="flex flex-col w-full my-1 overflow-hidden">
        <div className="flex-none whitespace-nowrap overflow-ellipsis text-white font-bold text-lg p-2 text-2xl">
          {data.name}
        </div>
      </div>

      <div className="p-0">
        <div className="flex">
          <div className="flex-none text-xs px-4 py-2">Duration: {data.duration.toFixed(2)} ms</div>

          <div className="flex-none text-xs px-4 py-2">Trace ID: {data.traceId}</div>
        </div>
      </div>
      {Array.isArray(data.children)
        ? data.children.map((child) => (
            <NestedSpan data={child} minTimestamp={minTimestamp} maxTimestamp={maxTimestamp} />
          ))
        : null}
    </div>
  );
};

const NestedSpan = ({ data, minTimestamp, maxTimestamp }) => (
  <Span data={data} isTopLevel={false} minTimestamp={minTimestamp} maxTimestamp={maxTimestamp} />
);

const ControlledTreeView = ({ traces }) => {
  const treeData = createTreeData(traces);
  const minTimestamp = Math.min(...traces.map((t) => t.timestamp));
  const maxTimestamp = Math.max(...traces.map((t) => t.timestamp + t.duration));

  return (
    <div className="text-white flex flex-col h-full w-full">
      <div className="p-4 text-graphql-otel-green"></div>

      <TreeView
        className="text-white w-full h-full p-4"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
      >
        {treeData.map((treeItem, i) => (
          <Span
            isTopLevel={treeItem.parentSpanId === undefined}
            key={treeItem.spanId}
            data={treeItem}
            minTimestamp={minTimestamp}
            maxTimestamp={maxTimestamp}
          />
        ))}
      </TreeView>
    </div>
  );
};

export function App() {
  const [result, reexecuteQuery] = useQuery<{ listTraceGroups: Query['listTraceGroups'] }>({
    query: ListTraceGroups,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div className="min-h-screen bg-graphql-otel-dark gradient-background flex flex-col border rounded p-4">
      <div className="w-full h-16 bg-white flex items-center justify-between p-4 border-b">
        <h1>My GraphQL App</h1>
      </div>
      <div className="flex flex-1 gap-5 py-10">
        <div className="w-3/10 h-full text-graphql-otel-green border-r p-4 rounded">
          <h2 className="text-lg p-4">GraphQL Schema</h2>
          <p className="p-4">Schema information will go here.</p>
        </div>
        <div className="flex flex-col h-full border p-4 rounded">
          <div>
            {data?.listTraceGroups.traces.map((t) => {
              return (
                <div key={t.id}>
                  <ControlledTreeView traces={t.spans} />;
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
