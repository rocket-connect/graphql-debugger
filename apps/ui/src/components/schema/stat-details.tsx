import classNames from "classnames";

import { Spinner } from "../utils/spinner";

export interface StatsDetailsProps {
  statsType:
    | "Resolve Count"
    | "Error Count"
    | "Average Duration"
    | "Last Resolved";
  statsDetails?: number | string;
  isLoading?: boolean;
}

export function StatsDetails({
  statsType,
  statsDetails,
  isLoading = true,
}: StatsDetailsProps) {
  return (
    <div className="flex items-center gap-1 ">
      <span>{statsType}:</span>
      {isLoading ? (
        <>
          <Spinner size={"2"} />
        </>
      ) : (
        <>
          <span
            className={classNames("font-bold", {
              ["text-red-500"]: statsType === "Error Count",
            })}
          >
            {statsDetails} {statsType === "Average Duration" && `ms`}
          </span>
        </>
      )}
    </div>
  );
}
