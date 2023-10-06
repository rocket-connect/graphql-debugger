import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import type { Trace } from "@graphql-debugger/types";

import { Link } from "react-router-dom";

import { logo } from "../../../utils/images";

export const TraceHeader = ({ trace }: { trace?: Trace }) => {
  const startTimeUnixNano = UnixNanoTimeStamp.fromString(
    trace?.rootSpan?.startTimeUnixNano || "0",
  );
  const traceDurationUnixNano = UnixNanoTimeStamp.fromString(
    trace?.rootSpan?.durationNano || "0",
  );
  const traceDurationSIUnits = traceDurationUnixNano.toSIUnits();

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="py-2 px-4 bg-white-100 rounded-2xl">
        {trace?.rootSpan?.name?.length === undefined ? (
          <p className="text-center text-neutral-100  font-semibold">
            No rootSpanName found!
          </p>
        ) : (
          <div className="text-neutral-100">
            <p className="font-semibold text-sm">
              <span className="underline">{trace?.rootSpan?.name}</span>
              {` - ${traceDurationSIUnits.value.toFixed(2)} ${
                traceDurationSIUnits.unit
              } `}
            </p>
            <p className="text-xs italic">
              {startTimeUnixNano.formatUnixNanoTimestamp()}
            </p>
          </div>
        )}
      </div>
      <Link to="/">
        <div className="flex flex-row gap-2 py-1">
          <img className="w-10 my-auto" src={logo}></img>
          <p className="my-auto text-xl text-neutral-100 font-bold">
            GraphQL Debugger
          </p>
        </div>
      </Link>
    </div>
  );
};
