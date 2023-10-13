import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import { Modal } from "../../../context/modal";
import { ModalWindow } from "../../modal/ModalWindow";
import { OpenModal } from "../../modal/OpenModal";
import { JsonViewer } from "../Editor";
import { RenderTree } from "./utils";

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

  let spanClasses = "absolute h-2";
  if (data.errorMessage) {
    spanClasses += " bg-red-500";
  } else {
    if (data.isForeign) {
      spanClasses += " bg-green-stripy";
    } else {
      spanClasses += " bg-graphql-otel-green";
    }
  }

  const displyInfo = (
    <p
      className={`tracking-widest ${
        data.errorMessage || data.errorStack ? "text-red-500" : {}
      } py-1`}
    >
      <span className="font-bold">{data.name}</span>
      {" - "}
      <span className="font-light">
        {Number(value).toFixed(2)} {unit}
      </span>
      {data.isForeign && (
        <span className="text-neutral-300 text-xs italic"> - (unknown)</span>
      )}
    </p>
  );

  return (
    <>
      <div
        data-trace-view-spanid={data.id}
        className="relative overflow-hidden flex flex-col gap-1 text-xs "
      >
        <Modal>
          <OpenModal opens="single-trace">
            <div className="py-4 hover:cursor-pointer">
              {displyInfo}
              <div
                className={`absolute h-2 bg-neutral/30 rounded-2xl w-full`}
              ></div>
              <div
                className={spanClasses}
                style={{ width, left: offset }}
              ></div>
            </div>
          </OpenModal>
          <ModalWindow name="single-trace" type="small" title={displyInfo}>
            <div className="flex flex-col gap-5 text-neutral-300 text-md divide-y-2 divide-neutral/10">
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
                id="span-json"
              />
            </div>
          </ModalWindow>
        </Modal>

        <div className="text-neutral-100 flex flex-col p-0 m-0">
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
    </>
  );
}
