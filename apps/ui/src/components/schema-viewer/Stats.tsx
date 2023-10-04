import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import { StatsDetails } from "./StatsDetails";
import type { StatsProps } from "./types";

export const Stats = ({ aggregate }: StatsProps) => {
  const lastResolveUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.lastResolved || "0",
  );
  const averageDurationUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.averageDuration || "0",
  );

  const hasResolved = lastResolveUnixNano.toString() !== "0";

  return (
    <div className="flex flex-col gap-1 text-neutral-100/80 pl-4 text-xs">
      <StatsDetails
        statsType="Resolve Count"
        statsDetails={aggregate?.resolveCount}
      />
      <StatsDetails
        statsType="Error Count"
        statsDetails={aggregate?.errorCount}
      />
      <StatsDetails
        statsType="Average Duration"
        statsDetails={averageDurationUnixNano.toMS()}
      />
      {hasResolved && (
        <StatsDetails
          statsType="Last Resolved"
          statsDetails={lastResolveUnixNano.formatUnixNanoTimestamp()}
        />
      )}
    </div>
  );
};
