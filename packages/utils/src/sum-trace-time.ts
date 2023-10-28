import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { Trace } from "@graphql-debugger/types";

export function sumTraceTime(tracegroup: Trace): UnixNanoTimeStamp {
  let bigint = BigInt(0);

  tracegroup.spans?.forEach((span) => {
    bigint =
      bigint +
      UnixNanoTimeStamp.fromString(span?.durationNano || "0").getBigInt();
  });

  return new UnixNanoTimeStamp(bigint);
}
