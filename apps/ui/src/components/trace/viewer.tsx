import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import type { Span as TSpan, Trace } from "@graphql-debugger/types";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ClientContext } from "../../context/client";
import { Modal } from "../../context/modal";
import { expand } from "../../images";
import { IDS } from "../../testing";
import { createTreeData } from "../../utils/create-tree-data";
import { DEFAULT_SLEEP_TIME, sleep } from "../../utils/sleep";
import { OpenModal } from "../modal/open";
import { ModalWindow } from "../modal/window";
import { Spinner } from "../utils/spinner";
import { Toggle } from "../utils/toggle";
import { Pill } from "./pill";
import { Span } from "./span";

function TraceView({ spans }: { spans: TSpan[] }) {
  const treeData = createTreeData(spans);

  const minTimestamp = UnixNanoTimeStamp.earliest(
    spans.map((t) => UnixNanoTimeStamp.fromString(t.startTimeUnixNano)),
  );
  const maxTimestamp = UnixNanoTimeStamp.latest(
    spans.map((t) => UnixNanoTimeStamp.fromString(t.endTimeUnixNano)),
  );

  return (
    <div className="text-neutral-100 flex flex-col">
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
  trace: Trace;
  setShowForeignTraces: (showForeignTraces: boolean) => void;
  showForeignTraces: boolean;
}) {
  return (
    <div className="flex flex-row justify-between gap-5 text-sm">
      <Pill trace={trace} bg="neutral/10" />
      <div className="my-auto mr-5">
        <Toggle
          name="Show foreign spans"
          enabled={showForeignTraces}
          onToggle={(x) => setShowForeignTraces(x)}
          color="app-blue"
        />
      </div>
    </div>
  );
}

export function TraceViewer() {
  const [showForeignTraces, setShowForeignTraces] = useState(true);
  const { client } = useContext(ClientContext);
  const [traces, setTraces] = useState<Trace[]>([]);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (params.traceId) {
          setIsLoading(true);

          const _traces = await client.trace.findMany({
            where: {
              id: params.traceId,
            },
            includeSpans: true,
            includeRootSpan: true,
          });

          await sleep(DEFAULT_SLEEP_TIME);

          setTraces(_traces);
        }
      } catch (error) {
        console.error(error);
        setTraces([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.traceId, client]);

  const trace = traces[0];
  const spans = trace?.spans;
  let modalSpans = spans;
  if (!showForeignTraces) {
    modalSpans = spans.filter((span) => !span.isForeign);
  }

  return (
    <div id={IDS.TRACE_VIEWER} className="overflow-y-scroll custom-scrollbar">
      <Modal key="trace-full-screen">
        <OpenModal opens="full-screen-trace">
          {trace ? (
            <button className="flex flex-row gap-3 text-neutral-100 text-sm hover:underline">
              <img className="w-6" src={expand} />
              <p className="my-auto">Expand</p>
            </button>
          ) : (
            <></>
          )}
        </OpenModal>
        <ModalWindow
          name="full-screen-trace"
          type="full-screen"
          title={
            <TraceModalHeader
              trace={trace}
              setShowForeignTraces={setShowForeignTraces}
              showForeignTraces={showForeignTraces}
            />
          }
        >
          <div className="px-4 pb-10">
            <TraceView spans={modalSpans} />
          </div>
        </ModalWindow>
      </Modal>

      {isLoading ? (
        <div className="flex justify-center align-center mx-auto mt-20">
          <Spinner />
        </div>
      ) : (
        <>
          {traces?.length ? (
            <TraceView spans={spans} />
          ) : (
            <div className="mx-auto text-center text-neutral-100 font-bold">
              No Trace Found
            </div>
          )}
        </>
      )}
    </div>
  );
}
