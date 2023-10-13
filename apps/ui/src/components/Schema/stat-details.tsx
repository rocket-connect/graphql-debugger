import classNames from "classnames";

import { Spinner } from "../utils/Spinner";
import type { StatsDetailsProps } from "./types";

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
