import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import { useContext } from "react";
import { Link } from "react-router-dom";

import { ClientContext } from "../../../context/client";
import { Delete } from "../../../icons/delete";

export function History() {
  const { historyTraces, handleDeleteHistoryTrace } = useContext(ClientContext);

  return (
    <div className="flex w-full flex-col gap-2">
      {historyTraces.map(({ schemaId, trace }) => {
        const durationUnixNano = UnixNanoTimeStamp.fromString(
          trace.rootSpan?.durationNano || "0",
        );

        const { value, unit } = durationUnixNano.toSIUnits();
        return (
          <div
            className="text-sm font-semibold text-neutral-100 flex items-center justify-between"
            role="button"
          >
            <Link to={`/schema/${schemaId}/trace/${trace.id}`}>
              {trace.rootSpan?.name}
            </Link>
            <span className="self-end font-normal">{`${value.toFixed(
              2,
            )} ${unit}`}</span>
            <button onClick={() => handleDeleteHistoryTrace(trace.id)}>
              <Delete color="red-500" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
