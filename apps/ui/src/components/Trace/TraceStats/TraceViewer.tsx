import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import type { Span as TSpan, Trace } from "@graphql-debugger/types";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { listTraceGroups } from "../../../api/list-trace-groups";
import { IDS } from "../../../testing";
import { Span } from "./Span";
import { createTreeData } from "./utils";

const TraceView = ({ spans }: { spans: TSpan[] }) => {
  const treeData = createTreeData(spans);

  const minTimestamp = UnixNanoTimeStamp.earliest(
    spans.map((t) => UnixNanoTimeStamp.fromString(t.startTimeUnixNano)),
  );
  const maxTimestamp = UnixNanoTimeStamp.latest(
    spans.map((t) => UnixNanoTimeStamp.fromString(t.endTimeUnixNano)),
  );

  return (
    <div className="text-neutral-100 flex flex-col">
      {treeData
        .sort((a, b) => {
          const aStart = UnixNanoTimeStamp.fromString(a.startTimeUnixNano)
            .toTimeStamp()
            .toString();
          const bStart = UnixNanoTimeStamp.fromString(b.startTimeUnixNano)
            .toTimeStamp()
            .toString();

          return new Date(aStart).getTime() - new Date(bStart).getTime();
        })
        .map((treeItem) => (
          <Span
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

  if (!traces?.length) {
    return <div></div>;
  }

  return (
    <div
      id={IDS.TRACE_VIEWER}
      className="basis-1/2 overflow-y-scroll custom-scrollbar"
    >
      {traces?.length && <TraceView spans={traces[0]?.spans || []} />}
    </div>
  );
}
