import { UnixNanoTimeStamp } from "@graphql-debugger/time";

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
    spanClasses += " bg-graphql-otel-green";
  }

  return (
    <div
      data-trace-view-spanid={data.id}
      className="relative overflow-hidden flex flex-col gap-1 text-xs"
    >
      <div className="py-4">
        <p
          className={`${
            data.errorMessage || data.errorStack ? "text-red-500" : {}
          } py-1`}
        >
          {data.name}{" "}
          <span className="font-light">
            {Number(value).toFixed(2)} {unit}
          </span>
        </p>
        <div className={`absolute h-2 bg-neutral/30 rounded-2xl w-full`}></div>
        <div className={spanClasses} style={{ width, left: offset }}></div>
      </div>

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
  );
}
