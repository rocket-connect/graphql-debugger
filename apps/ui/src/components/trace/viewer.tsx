import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import type { Span as TSpan, Trace } from "@graphql-debugger/types";

import { useState } from "react";

import { Modal } from "../../components/modal/modal";
import { ExpandIcon } from "../../icons/expand";
import { IDS } from "../../testing";
import { createTreeData } from "../../utils/create-tree-data";
import { Toggle } from "../utils/toggle";
import { Pill } from "./pill";
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

export function TraceModalHeader({
  trace,
  setShowForeignTraces,
  showForeignTraces,
}: {
  trace?: Trace;
  setShowForeignTraces: (showForeignTraces: boolean) => void;
  showForeignTraces: boolean;
}) {
  return (
    <div className="flex flex-row justify-between gap-5 text-sm">
      <Pill trace={trace} />
      <div className="my-auto mr-5">
        <Toggle
          label="Show foreign spans"
          initialState={showForeignTraces}
          onToggle={(x) => setShowForeignTraces(x)}
          blueToggle
        />
      </div>
    </div>
  );
}

export function TraceViewer({ trace }: { trace?: Trace }) {
  const [showForeignTraces, setShowForeignTraces] = useState(true);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const spans = trace?.spans || [];
  let modalSpans = spans;
  if (!showForeignTraces) {
    modalSpans = spans?.filter((span) => !span.isForeign);
  }

  return (
    <div
      id={IDS.trace_viewer.view}
      className="overflow-y-scroll basis-1/2 flex-shrink-0 flex-grow-0 h-full custom-scrollbar"
    >
      {trace ? (
        <button
          onClick={() => setShowFullScreen(true)}
          className="flex flex-row items-center gap-3 text-neutral text-sm hover:underline"
          id={IDS.trace_viewer.expand}
        >
          <ExpandIcon height={25} width={25} />
          <p className="my-auto">Expand</p>
        </button>
      ) : (
        <></>
      )}
      <Modal
        type="full-screen"
        onClose={() => setShowFullScreen(false)}
        open={showFullScreen}
        title={
          <TraceModalHeader
            trace={trace}
            setShowForeignTraces={setShowForeignTraces}
            showForeignTraces={showForeignTraces}
          />
        }
      >
        <div className="px-4 pb-10">
          <TraceView spans={modalSpans ?? []} id={IDS.trace_viewer.expand} />
        </div>
      </Modal>
      {trace?.rootSpan ? (
        <TraceView id={IDS.trace_viewer.default} spans={spans} />
      ) : (
        <div
          id={IDS.trace_viewer.not_found}
          className="mx-auto text-center text-neutral font-bold"
        >
          <p className="mt-20">No Trace Selected</p>
        </div>
      )}
    </div>
  );
}
