import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import type { Schema } from "@graphql-debugger/types";

import { useContext } from "react";
import { Link } from "react-router-dom";

import { ClientContext } from "../../../context/client";
import { SchemasContext } from "../../../context/schemas";
import { Delete } from "../../../icons/delete";

export function History() {
  const { historyTraces, handleDeleteHistoryTrace } = useContext(ClientContext);
  const schemasContext = useContext(SchemasContext);

  const schema = (schemaId: string): Schema | undefined => {
    return schemasContext?.schemas.find((schema) => schema.id === schemaId);
  };

  return (
    <div className="flex w-full flex-col gap-3 divide-y-2 divide-neutral/10">
      {historyTraces.map(({ schemaId, trace, uniqueId }) => {
        const durationUnixNano = UnixNanoTimeStamp.fromString(
          trace.rootSpan?.durationNano || "0",
        );

        const startTimeUnixNano = UnixNanoTimeStamp.fromString(
          trace.rootSpan?.startTimeUnixNano || "0",
        );

        const { value, unit } = durationUnixNano.toSIUnits();
        return (
          <div
            className="text-sm text-neutral-100 flex items-center justify-between p-1"
            role="button"
            key={uniqueId}
          >
            <div className="flex flex-col gap-1">
              <Link
                to={`/schema/${schemaId}/trace/${trace.id}`}
                className="font-semibold"
                onClick={() => {
                  schemasContext?.setSelectedSchema(schema(schemaId ?? ""));
                }}
              >
                {trace.rootSpan?.name}
              </Link>
              <p className="ml-5 text-xs">
                - {startTimeUnixNano.formatUnixNanoTimestamp()}
              </p>
            </div>

            <div className="self-baseline flex justify-center items-center gap-3">
              <span className="self-end font-normal">{`${value.toFixed(
                2,
              )} ${unit}`}</span>
              <button onClick={() => handleDeleteHistoryTrace(uniqueId ?? "")}>
                <Delete color="red-500" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
