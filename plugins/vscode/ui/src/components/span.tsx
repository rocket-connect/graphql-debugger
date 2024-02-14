import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { cn } from "@graphql-debugger/ui/src/utils/cn";
import { RenderTree } from "@graphql-debugger/ui/src/utils/create-tree-data";
import { isSpanError } from "@graphql-debugger/utils";

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

  const displyInfo = (
    <p
      className={cn("tracking-widest py-2", {
        "text-red": data.errorMessage || data.errorStack,
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
      <div className="py-1.5 hover:cursor-pointer hover:underline">
        {displyInfo}
        <div className="relative h-4 rounded-md bg-gray-400">
          <div
            data-line="span-line"
            className={cn("absolute rounded-md h-4 bg-light-green", {
              "bg-indigo-600": data.isForeign,
              "bg-red": isSpanError(data),
            })}
            style={{ width, left: offset }}
          ></div>
        </div>
      </div>

      <div className="text-neutral flex flex-col p-0 m-0 pl-10 border-l-2 border-l-accent">
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
