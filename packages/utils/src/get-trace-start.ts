import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { Trace } from "@graphql-debugger/types";

export function getTraceStart(trace: Trace): UnixNanoTimeStamp {
  const times = trace.spans?.map((span) => {
    return UnixNanoTimeStamp.fromString(span.startTimeUnixNano);
  });

  return UnixNanoTimeStamp.earliest(times);
}
