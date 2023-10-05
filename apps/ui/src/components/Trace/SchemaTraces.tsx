import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { ListTraceGroupsWhere, Trace } from "@graphql-debugger/types";

import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { listTraceGroups } from "../../api/list-trace-groups";

export const SchemaTraces = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [selectedTrace, setSelectedTrace] = useState<Trace | undefined>(
    undefined,
  );

  const { data: traces } = useQuery({
    queryKey: ["traces", params.schemaId, searchParams.get("rootSpanName")],
    queryFn: async () => {
      const _traces = await listTraceGroups({
        where: {
          schemaId: params.schemaId,
          rootSpanName: searchParams.get("rootSpanName"),
        },
        includeRootSpan: true,
      });

      return _traces.filter((trace) => trace.rootSpan?.name?.length ?? 0 > 0);
    },
  });

  const handleSelectTrace = (trace: Trace) => {
    setSelectedTrace(trace);
  };

  useEffect(() => {
    if (!params.traceId && traces?.length) {
      navigate(`/schema/${params.schemaId}/trace/${traces[0].id}`);
    }
    if (selectedTrace) {
      navigate(
        `/schema/${
          params.schemaId
        }/trace/${selectedTrace?.id}?${searchParams.toString()}`,
      );
    }
  }, [selectedTrace, traces, navigate, searchParams, params.schemaId]);

  return (
    <div className="bg-white-100 flex-grow rounded-3xl shadow-xl divide-y-2 divide-neutral/10">
      <div className="flex items-center p-5 justify-between">
        <div className="flex flex-col">
          <p className="text-md font-bold text-neutral-100">Traces</p>
          <p className=" text-sm">List of the latest GraphQL queries.</p>
        </div>
        <div className="flex items-center underline gap-2 text-sm">
          <p role="button">Refresh filters</p>
          <p role="button">Delete traces</p>
        </div>
      </div>
      <div className="p-5">
        {traces?.length === 0 ? (
          <div className="font-bold text-neutral-100 flex items-center justify-center">
            No traces found
          </div>
        ) : (
          <div className="h-96 overflow-y-scroll custom-scrollbar w-full">
            <table className="w-full">
              <thead className="text-sm">
                <th>Name</th>
                <th>Duration</th>
                <th>Start</th>
                <th>End</th>
              </thead>
              <tbody>
                {traces?.map((trace) => {
                  const rootSpan = trace.rootSpan;
                  const isSelected = trace.id === params.traceId;
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

                  return (
                    <tr
                      data-spanid={rootSpan?.id}
                      key={trace.id}
                      className="border-b border-graphiql-border  text-neutral-100"
                      onClick={() => handleSelectTrace(trace)}
                    >
                      <th
                        className={classNames(
                          `px-6 py-4 font-normal whitespace-nowrap text-left `,
                          { "font-bold": isSelected },
                        )}
                        role="button"
                      >
                        {rootSpan?.name}
                      </th>
                      <td className="px-6 py-4">{`${value.toFixed(
                        2,
                      )} ${unit}`}</td>
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
        )}
      </div>
    </div>
  );
};
