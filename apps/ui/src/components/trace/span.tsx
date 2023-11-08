import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import { Modal } from "../../context/modal";
import { RenderTree } from "../../utils/create-tree-data";
import { isSpanError } from "../../utils/is-trace-error";
import { OpenModal } from "../modal/open";
import { ModalWindow } from "../modal/window";
import { JsonViewer } from "./editor/json/viewer";

export function Span({
  data,
  minTimestamp,
  maxTimestamp,
}: {
  data: RenderTree;
  minTimestamp: UnixNanoTimeStamp;
  maxTimestamp: UnixNanoTimeStamp;
}) {
  const durationNano = UnixNanoTimeStamp.fromString(data.durationNano);
  const startTimeUnixNano = UnixNanoTimeStamp.fromString(
    data.startTimeUnixNano,
  );

  const { width, offset } = durationNano.calculateWidthAndOffset(
    startTimeUnixNano,
    minTimestamp,
    maxTimestamp,
  );

  const { value, unit } = durationNano.toSIUnits();

  let spanClasses = "absolute h-4";
  if (isSpanError(data)) {
    spanClasses += " bg-red-500";
  } else {
    if (data.isForeign) {
      spanClasses += " bg-app-blue";
    } else {
      spanClasses += " bg-graphql-otel-green";
    }
  }

  const displyInfo = (
    <p
      className={`tracking-widest ${
        data.errorMessage || data.errorStack ? "text-red-500" : {}
      } py-2`}
      data-info="span-info"
    >
      <span className="font-bold" data-name="span-name">
        {data.name}
      </span>
      {" - "}
      <span className="font-light" data-time="span-time">
        {Number(value).toFixed(2)} {unit}
      </span>
      {data.isForeign && (
        <span
          className="text-neutral-300 text-xs italic font-bold"
          data-foreign="span-foreign"
        >
          {" "}
          - (unknown)
        </span>
      )}
    </p>
  );

  return (
    <div
      data-traceviewspanid={data.id}
      className="relative overflow-hidden flex flex-col gap-1 text-xs"
    >
      <Modal>
        <OpenModal id={`trace-open-modal-${data.id}`} opens="single-trace">
          <div className="py-4 hover:cursor-pointer hover:underline">
            {displyInfo}
            <div
              className={`absolute h-4 bg-background rounded-2xl w-full`}
            ></div>
            <div
              data-line="span-line"
              className={spanClasses}
              style={{ width, left: offset }}
            ></div>
          </div>
        </OpenModal>
        <ModalWindow name="single-trace" type="small" title={displyInfo}>
          <div className="flex flex-col gap-5 text-neutral-300 text-md divide-y-2 divide-accent">
            <JsonViewer
              json={JSON.stringify(
                {
                  ...data,
                  children: undefined,
                  errorMessage: undefined,
                  errorStack: undefined,
                  ...(data.attributes
                    ? { attributes: JSON.parse(data.attributes) }
                    : { attributes: undefined }),
                },
                null,
                2,
              )}
            />
          </div>
        </ModalWindow>
      </Modal>

      <div className="text-neutral-100 flex flex-col p-0 m-0 pl-10 border-l-2 hover:border-neutral/20">
        {Array.isArray(data.children)
          ? data.children.map((child) => (
              <Span
                key={child.id}
                data={child}
                minTimestamp={minTimestamp}
                maxTimestamp={maxTimestamp}
              />
            ))
          : null}
      </div>
    </div>
  );
}
