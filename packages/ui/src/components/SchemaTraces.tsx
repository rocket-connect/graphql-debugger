import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { graphql } from "@graphql-debugger/types";

import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { listTraceGroups } from "../api/list-trace-groups";
import { IDS } from "../testing";

export function SchemaTraces({ schemaId }: { schemaId: string }) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [traces, setTraces] = useState<graphql.Trace[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<graphql.Trace | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      try {
        const where: graphql.ListTraceGroupsWhere = {
          schemaId,
        };

        const name = searchParams.get("rootSpanName");
        if (name) {
          where.rootSpanName = name;
        }

        const _traces = await listTraceGroups({
          where,
          includeRootSpan: true,
        });

        if (!params.traceId && _traces.length) {
          navigate(`/schema/${schemaId}/trace/${_traces[0].id}`);
        }
        setTraces(_traces);
      } catch (error) {
        console.error(error);
        setTraces([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("rootSpanName"), schemaId]);

  useEffect(() => {
    if (selectedTrace) {
      navigate(
        `/schema/${schemaId}/trace/${selectedTrace?.id}?${searchParams.toString()}`,
      );
    }
  }, [selectedTrace, traces, navigate, searchParams, schemaId]);

  return (
    <div className="relative" id={IDS.SCHEMA_TRACES}>
      <table className="text-xs text-left w-full table-fixed">
        <colgroup>
          <col className="w-1/4" />
          <col className="w-1/4" />
          <col className="w-1/4" />
          <col className="w-1/4" />
        </colgroup>
        <thead className="text-xs text-graphiql-light">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Duration
            </th>
            <th scope="col" className="px-6 py-3">
              Start
            </th>
            <th scope="col" className="px-6 py-3">
              End
            </th>
          </tr>
        </thead>
        <tbody>
          {traces.map((trace) => {
            const isSelected = trace.id === params.traceId;
            const rootSpan = trace.rootSpan;
            const errorMessage = trace?.firstSpanErrorMessage;
            const startTimeUnixNano = UnixNanoTimeStamp.fromString(
              rootSpan?.startTimeUnixNano || "0",
            );
            const endTimeUnixNano = UnixNanoTimeStamp.fromString(
              rootSpan?.endTimeUnixNano || "0",
            );
            const durationUnixNano = UnixNanoTimeStamp.fromString(
              rootSpan?.durationNano || "0",
            );

            const { value, unit } = durationUnixNano.toSIUnits();

            let traceClasses = "absolute h-3 ";
            if (isSelected) {
              traceClasses += " font-bold underline";
            }

            if (errorMessage) {
              traceClasses += " text-red-500 underline-graphql-otel-red-500";
            } else {
              traceClasses += " text-green-500 underline-graphql-otel-green";
            }

            return (
              <tr
                data-spanid={rootSpan?.id}
                key={trace.id}
                className="border-b border-graphiql-border text-graphiql-light"
                onClick={() => setSelectedTrace(trace)}
              >
                <th
                  scope="row"
                  className={`px-6 py-4 font-medium whitespace-nowrap ${traceClasses}`}
                >
                  {rootSpan?.name}
                </th>
                <td className="px-6 py-4">{`${value.toFixed(2)} ${unit}`}</td>
                <td className="px-6 py-4">
                  {startTimeUnixNano.formatUnixNanoTimestamp()}
                </td>
                <td className="px-6 py-4">
                  {endTimeUnixNano.formatUnixNanoTimestamp()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
