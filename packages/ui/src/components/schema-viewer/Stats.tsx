import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { graphql } from "@graphql-debugger/types";

export function Stats({
  aggregate,
}: {
  aggregate: graphql.AggregateSpansResponse | null;
}) {
  const lastResolveUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.lastResolved || "0",
  );
  const averageDurationUnixNano = UnixNanoTimeStamp.fromString(
    aggregate?.averageDuration || "0",
  );

  const hasResolved = lastResolveUnixNano.toString() !== "0";

  return (
    <div className="pl-2 text-xs font-light text-graphiql-light">
      <ul className="list-disc list-inside marker:text-graphql-otel-green flex flex-col gap-2 ">
        <li>
          Resolve Count:{" "}
          <span className="font-bold">{aggregate?.resolveCount}</span>
        </li>
        <li>
          Error Count:{" "}
          <span className="font-bold text-red-500">
            {aggregate?.errorCount}
          </span>
        </li>
        <li>
          Average Duration:{" "}
          <span className="font-bold">{averageDurationUnixNano.toMS()} ms</span>
        </li>
        {hasResolved ? (
          <li>
            Last Resolved:{" "}
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
