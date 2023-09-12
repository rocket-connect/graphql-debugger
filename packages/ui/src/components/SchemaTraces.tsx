import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ListTraceGroupsWhere, Trace } from "../graphql-types";
import { listTraceGroups } from "../api/list-trace-groups";
import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { IDS } from "../testing";

export function SchemaTraces({ schemaId }: { schemaId: string }) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [traces, setTraces] = useState<Trace[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<Trace | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      try {
        const where: ListTraceGroupsWhere = {
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
          <col className="w-1/3" />
          <col className="w-1/3" />
          <col className="w-1/3" />
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
              When
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
            const durationUnixNano = UnixNanoTimeStamp.fromString(
              rootSpan?.durationNano || "0",
            );

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
                <td className="px-6 py-4">
                  {durationUnixNano.toMS().toFixed(2)} ms
                </td>
                <td className="px-6 py-4">
                  {startTimeUnixNano.formatUnixNanoTimestamp()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
