import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { Trace } from "@graphql-debugger/types";

import { IDS } from "../../testing";

export function Pill({
  trace,
  bg = "white-100",
}: {
  trace?: Trace;
  bg?: string;
}) {
  const startTimeUnixNano = UnixNanoTimeStamp.fromString(
    trace?.rootSpan?.startTimeUnixNano || "0",
  );
  const traceDurationUnixNano = UnixNanoTimeStamp.fromString(
    trace?.rootSpan?.durationNano || "0",
  );
  const traceDurationSIUnits = traceDurationUnixNano.toSIUnits();

  return (
    <div
      id={IDS.trace.pill}
      className={`py-2 px-4 bg-${bg} rounded-2xl text-neutral-100`}
    >
      <p className="font-semibold">
        <span className="underline">{trace?.rootSpan?.name}</span>
        {` - ${traceDurationSIUnits.value.toFixed(2)} ${
          traceDurationSIUnits.unit
        } `}
      </p>
      <p className="text-xs italic">
        {startTimeUnixNano.formatUnixNanoTimestamp()}
      </p>
    </div>
  );
}
