import { cn } from "../../utils/cn";

export interface StatsDetailsProps {
  statsType:
    | "Resolve Count"
    | "Error Count"
    | "Average Duration"
    | "Last Resolved";
  statsDetails?: number | string;
}

export function StatsDetails({ statsType, statsDetails }: StatsDetailsProps) {
  return (
    <div className="flex items-center gap-1 ">
      <span>{statsType}:</span>

      <span
        className={cn("font-bold", {
          ["text-error-red"]: statsType === "Error Count",
        })}
      >
        {statsDetails} {statsType === "Average Duration" && `ms`}
      </span>
    </div>
  );
}
