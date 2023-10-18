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

export function TraceViewer() {
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

  return (
    <>
      <div
        id={IDS.TRACE_VIEWER}
        className="basis-1/2 overflow-y-scroll custom-scrollbar"
      >
        <Modal key="trace-full-screen">
          <OpenModal opens="full-screen-trace">
            <button className="flex flex-row gap-3 text-neutral-100 text-sm hover:underline">
              <img className="w-6" src={expand} />
              <p className="my-auto">Expand</p>
            </button>
          </OpenModal>
          <ModalWindow
            name="full-screen-trace"
            type="full-screen"
            title={
              <div className="flex flex-row justify-between text-sm">
                <Pill trace={traces[0]} bg="neutral/10" />
              </div>
            }
          >
            {traces?.length ? (
              <div className="mb-10 px-10 pb-10">
                <TraceView spans={traces[0]?.spans || []} />
              </div>
            ) : (
              <div className="mx-auto text-center text-neutral-100 font-bold">
                No Trace Found
              </div>
            )}
          </ModalWindow>
        </Modal>

        {isLoading ? (
          <div className="flex justify-center align-center mx-auto mt-20">
            <Spinner />
          </div>
        ) : (
          <>
            {traces?.length ? (
              <TraceView spans={traces[0]?.spans || []} />
            ) : (
              <div className="mx-auto text-center text-neutral-100 font-bold">
                No Trace Found
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
