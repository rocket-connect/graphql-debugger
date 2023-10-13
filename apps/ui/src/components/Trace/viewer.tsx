import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import type { Span as TSpan, Trace } from "@graphql-debugger/types";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { client } from "../../client";
import { Modal } from "../../context/modal";
import { IDS } from "../../testing";
import { DEFAULT_SLEEP_TIME, sleep } from "../../utils/sleep";
import { OpenModal } from "../modal/open";
import { ModalWindow } from "../modal/window";
import { Spinner } from "../utils/Spinner";
import { Span } from "./span";
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
};

export function TraceViewer() {
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
  }, [params.traceId]);

  return (
    <>
      <div
        id={IDS.TRACE_VIEWER}
        className="basis-1/2 overflow-y-scroll custom-scrollbar"
      >
        <Modal key="trace-full-screen">
          <OpenModal opens="full-screen-trace">
            <button className="flex items-end text-neutral-100 font-semibold">
              Expand trace
            </button>
          </OpenModal>
          <ModalWindow
            name="full-screen-trace"
            type="full-screen"
            title={
              <div className="text-neutral-100">
                <p className="font-semibold">
                  <span>{traces[0]?.spans[0].name}</span>
                </p>
              </div>
            }
          >
            {traces?.length ? (
              <div>
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
            {" "}
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
