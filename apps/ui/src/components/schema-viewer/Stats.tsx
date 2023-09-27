import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import type { StatsProps } from "./types";

export function Stats({ aggregate }: StatsProps) {
  const lastResolveUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.lastResolved || "0",
  );
  const averageDurationUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.averageDuration || "0",
  );

  const hasResolved = lastResolveUnixNano.toString() !== "0";

  return (
    <div className="pl-2 text-xs">
      <ul className="flex flex-col gap-1 text-neutral-100/80 ">
        <li className="flex items-center gap-1">
          Resolve Count:
          <span className="font-bold">{aggregate?.resolveCount}</span>
        </li>
        <li className="flex items-center gap-1">
          Error Count:
          <span className="font-bold text-red-500">
            {aggregate?.errorCount}
          </span>
        </li>
        <li className="flex items-center gap-1">
          Average Duration:
          <span className="font-bold">{averageDurationUnixNano.toMS()} ms</span>
        </li>
        {hasResolved ? (
          <li className="flex items-center gap-1">
            Last Resolved:
            <span className="font-bold">
              {lastResolveUnixNano.formatUnixNanoTimestamp()}
            </span>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
}
