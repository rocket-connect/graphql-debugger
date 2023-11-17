import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import { useState } from "react";

import { Modal } from "../../components/modal/modal";
import { cn } from "../../utils/cn";
import { RenderTree } from "../../utils/create-tree-data";
import { isSpanError } from "../../utils/is-trace-error";
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
  const [modal, setModal] = useState(false);
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

  const displyInfo = (
    <p
      className={cn("tracking-widest py-2", {
        "text-red-500": data.errorMessage || data.errorStack,
      })}
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
      <div
        className="py-1.5 hover:cursor-pointer hover:underline"
        onClick={() => setModal(true)}
      >
        {displyInfo}
        <div className="relative h-4 rounded-md bg-gray-400">
          <div
            className={cn("absolute rounded-md h-4 bg-secondary-green", {
              "bg-sky-800": data.isForeign,
              "bg-red-500": isSpanError(data),
            })}
            style={{ width, left: offset }}
          ></div>
        </div>
      </div>
      <Modal
        type="small"
        open={modal}
        onClose={() => setModal(false)}
        title={displyInfo}
      >
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
      </Modal>

      <div className="text-neutral-100 flex flex-col p-0 m-0 pl-10 border-l-2 border-l-accent">
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
