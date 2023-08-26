import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS into your file

const traces = [
  {
    traceId: "46cb720c4cc8b0c1e28cabd112057b78",
    parentId: undefined,
    traceState: undefined,
    name: "query users",
    id: "2a5f8b696abf9858",
    kind: 0,
    timestamp: 1692991856402000,
    duration: 1005447.292,
    attributes: {
      "graphql.operation.name": "users",
      "graphql.operation.type": "query",
      "graphql.document":
        "{\n" +
        "  users {\n" +
        "    name\n" +
        "    age\n" +
        "    posts {\n" +
        "      title\n" +
        "      content\n" +
        "      comments {\n" +
        "        content\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}",
      "graphql.operation.returnType": "[User]",
    },
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: "46cb720c4cc8b0c1e28cabd112057b78",
    parentId: "2a5f8b696abf9858",
    traceState: undefined,
    name: "User name",
    id: "b496e68882240e49",
    kind: 0,
    timestamp: 1692991857440000,
    duration: 1165.959,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: "46cb720c4cc8b0c1e28cabd112057b78",
    parentId: "2a5f8b696abf9858",
    traceState: undefined,
    name: "User age",
    id: "443fd2e5e4f00845",
    kind: 0,
    timestamp: 1692991857440000,
    duration: 1785.875,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: "46cb720c4cc8b0c1e28cabd112057b78",
    parentId: "2a5f8b696abf9858",
    traceState: undefined,
    name: "User posts",
    id: "c96662d3273a7415",
    kind: 0,
    timestamp: 1692991857441000,
    duration: 2001685.792,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: "46cb720c4cc8b0c1e28cabd112057b78",
    parentId: "c96662d3273a7415",
    traceState: undefined,
    name: "Posts title",
    id: "4aa8f7495bc7546c",
    kind: 0,
    timestamp: 1692991859445000,
    duration: 789.167,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: "46cb720c4cc8b0c1e28cabd112057b78",
    parentId: "c96662d3273a7415",
    traceState: undefined,
    name: "Posts content",
    id: "b8b21753292a8794",
    kind: 0,
    timestamp: 1692991859445000,
    duration: 1557.542,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: "46cb720c4cc8b0c1e28cabd112057b78",
    parentId: "c96662d3273a7415",
    traceState: undefined,
    name: "Posts comments",
    id: "3877c153fa0d43d6",
    kind: 0,
    timestamp: 1692991859445000,
    duration: 3002244.542,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: "46cb720c4cc8b0c1e28cabd112057b78",
    parentId: "3877c153fa0d43d6",
    traceState: undefined,
    name: "Comment content",
    id: "9c027ebcb7fb03a3",
    kind: 0,
    timestamp: 1692991862457000,
    duration: 206.625,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
];

type Trace = {
  id: string;
  name: string;
  parentId?: string;
  traceId: string;
  attributes: object;
  timestamp: number;
  duration: number;
};

type RenderTree = {
  id: string;
  name: string;
  traceId: string;
  attributes: object;
  children: RenderTree[];
  timestamp: number;
  duration: number;
  parentId?: string;
};

const createTreeData = (traceArray: Trace[]): RenderTree[] => {
  const treeData: RenderTree[] = [];
  const lookup: { [key: string]: RenderTree } = {};

  traceArray.forEach((trace) => {
    lookup[trace.id] = {
      id: trace.id,
      name: trace.name,
      traceId: trace.traceId,
      attributes: trace.attributes,
      children: [],
      timestamp: trace.timestamp,
      duration: trace.duration,
      parentId: trace.parentId,
    };
  });

  traceArray.forEach((trace) => {
    if (trace.parentId) {
      lookup[trace.parentId]?.children?.push(lookup[trace.id]);
    } else {
      treeData.push(lookup[trace.id]);
    }
  });

  return treeData;
};

const renderTree = (treeData, minTimestamp, maxTimestamp) => {
  const left = `${
    ((treeData.timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * 100
  }%`;

  let width = `${(treeData.duration / (maxTimestamp - minTimestamp)) * 100}%`;
  const widthNumber = parseFloat(width.split("%")[0]);
  if (widthNumber < 5) {
    width = "5%";
  }

  return (
    <TreeItem
      key={treeData.id}
      nodeId={treeData.id}
      label={
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
      }
    >
      {Array.isArray(treeData.children)
        ? treeData.children.map((child) =>
            renderTree(child, minTimestamp, maxTimestamp)
          )
        : null}
    </TreeItem>
  );
};

const Span = ({ data, minTimestamp, maxTimestamp, isTopLevel }) => {
  let left, width;

  if (isTopLevel) {
    left = "0%";
    width = "100%";
  } else {
    left = `${
      ((data.timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * 100
    }%`;
    width = `${(data.duration / (maxTimestamp - minTimestamp)) * 100}%`;
    if (parseFloat(width.split("%")[0]) < 5) {
      width = "3%";
    }
  }

  if (parseFloat(left.split("%")[0]) > 99) {
    left = "98%";
  }

  return (
    <div className="relative">
      <div className="absolute h-3 bg-gray-300 w-full"></div>
      <div className="absolute h-3 bg-green-500" style={{ left, width }}></div>
      <TreeItem
        key={data.id}
        nodeId={data.id}
        label={
          <div className="flex flex-col w-full my-1 overflow-hidden">
            <div className="flex-none whitespace-nowrap overflow-ellipsis text-white font-bold text-lg p-2 text-2xl">
              {data.name}
            </div>
          </div>
        }
      >
        <div className="p-0">
          <div className="flex">
            <div className="flex-none text-xs px-4 py-2">
              Duration: {data.duration.toFixed(2)} ms
            </div>

            <div className="flex-none text-xs px-4 py-2">
              Trace ID: {data.traceId}
            </div>
          </div>
        </div>
        {Array.isArray(data.children)
          ? data.children.map((child) => (
              <NestedSpan
                data={child}
                minTimestamp={minTimestamp}
                maxTimestamp={maxTimestamp}
              />
            ))
          : null}
      </TreeItem>
    </div>
  );
};

const NestedSpan = ({ data, minTimestamp, maxTimestamp }) => (
  <Span
    data={data}
    isTopLevel={false}
    minTimestamp={minTimestamp}
    maxTimestamp={maxTimestamp}
  />
);

const ControlledTreeView = () => {
  const treeData = createTreeData(traces);
  const minTimestamp = Math.min(...traces.map((t) => t.timestamp));
  const maxTimestamp = Math.max(...traces.map((t) => t.timestamp + t.duration));

  return (
    <div className="min-h-screen text-white flex flex-col h-full w-full">
      <div className="p-4 text-graphql-otel-green">
        <div className="flex justify-between">
          <div>
            <span>Total Traces: </span> <span>{treeData.length}</span>{" "}
          </div>
          <div>
            <span>Min Timestamp: </span> <span>{minTimestamp}</span>{" "}
          </div>
          <div>
            <span>Max Timestamp: </span> <span>{maxTimestamp}</span>{" "}
          </div>
        </div>
      </div>

      <TreeView
        className="text-white w-full h-full p-4"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
      >
        {treeData.map((treeItem, i) => (
          <Span
            isTopLevel={treeItem.parentId === undefined}
            key={treeItem.id}
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
        <div className="flex-1 h-full border p-4 rounded">
          <ControlledTreeView />
        </div>
      </div>
    </div>
  );
}
