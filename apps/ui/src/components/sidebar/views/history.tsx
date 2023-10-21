import { UnixNanoTimeStamp } from "@graphql-debugger/time";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ClientContext } from "../../../context/client";

export function History() {
  const { historyTraces } = useContext(ClientContext);
  const navigate = useNavigate();

  const handleClick = (traceId: string, schemaId: string) => {
    navigate(`/schema/${schemaId}/trace/${traceId}`);
  };

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
            onClick={() => handleClick(trace.id, schemaId)}
          >
            <span>{trace.rootSpan?.name}</span>
            <span className="self-end font-normal">{`${value.toFixed(
              2,
            )} ${unit}`}</span>
          </div>
        );
      })}
    </div>
  );
}
