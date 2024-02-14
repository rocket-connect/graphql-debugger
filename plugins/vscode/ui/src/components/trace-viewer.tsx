import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import type { Span as TSpan, Trace } from "@graphql-debugger/types";
import { createTreeData } from "@graphql-debugger/ui/src/utils/create-tree-data";

import { Span } from "./span";

function TraceView({ id, spans }: { id?: string; spans: TSpan[] }) {
  const treeData = createTreeData(spans);

  const minTimestamp = UnixNanoTimeStamp.earliest(
    spans.map((t) => UnixNanoTimeStamp.fromString(t.startTimeUnixNano)),
  );
  const maxTimestamp = UnixNanoTimeStamp.latest(
    spans.map((t) => UnixNanoTimeStamp.fromString(t.endTimeUnixNano)),
  );

  return (
    <div id={id} className="text-neutral flex flex-col">
      {treeData.map((treeItem) => (
        <Span
          key={treeItem.spanId}
          data={treeItem}
          minTimestamp={minTimestamp}
          maxTimestamp={maxTimestamp}
        />
      ))}
    </div>
  );
}

export function TraceViewer({ trace }: { trace?: Trace }) {
  const spans = trace?.spans || [];

  return (
    <div className="overflow-y-scroll basis-1/2 flex-shrink-0 flex-grow-0 h-full custom-scrollbar">
      {trace?.rootSpan ? (
        <TraceView spans={spans} />
      ) : (
        <div className="mx-auto text-center text-neutral font-bold">
          <p className="mt-20">No Trace Selected</p>
        </div>
      )}
    </div>
  );
}
