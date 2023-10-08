import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { Trace } from "@graphql-debugger/types";

import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { listTraceGroups } from "../../../api/list-trace-groups";
import { Spinner } from "../../../components/utils/Spinner";
import { IDS } from "../../../testing";

export const SchemaTraces = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [selectedTrace, setSelectedTrace] = useState<Trace | undefined>(
    undefined,
  );

  const { data: traces, isLoading } = useQuery({
    queryKey: ["traces", params.schemaId, searchParams.get("rootSpanName")],
    queryFn: async () => {
      const _traces = await listTraceGroups({
        where: {
          schemaId: params.schemaId,
          rootSpanName: searchParams.get("rootSpanName"),
        },
        includeRootSpan: true,
      });

      return _traces;
    },
  });

  const handleSelectTrace = (trace: Trace) => {
    setSelectedTrace(trace);
  };

  useEffect(() => {
    if (!params.traceId && traces?.length) {
      navigate(
        `/schema/${params.schemaId}/trace/${
          traces[0].id
        }?${searchParams.toString()}`,
      );
    }
    if (selectedTrace) {
      navigate(
        `/schema/${
          params.schemaId
        }/trace/${selectedTrace?.id}?${searchParams.toString()}`,
      );
    }
  }, [
    selectedTrace,
    traces,
    navigate,
    searchParams,
    params.schemaId,
    params.traceId,
  ]);

  return (
    <div
      className="bg-white-100 flex-grow rounded-2xl divide-y-2 divide-neutral/10"
      id={IDS.SCHEMA_TRACES}
    >
      <div className="flex items-center p-5 justify-between text-neutral-100">
        <div className="flex flex-col">
          <p className="text-md font-bold">Traces</p>
          <p className="text-sm">List of the latest GraphQL queries.</p>
        </div>
        <div className="flex items-center underline gap-2 text-sm">
          <p
            role="button"
            onClick={() => navigate(`/schema/${params.schemaId}`)}
          >
            Refresh filters
          </p>
        </div>
      </div>
      <div className="p-5">
        <div className="h-96 overflow-y-scroll custom-scrollbar w-full">
          {isLoading ? (
            <div className="flex align-center justify-center mx-aut mt-20">
              <Spinner />
            </div>
          ) : (
            <>
              <table className="w-full text-xs">
                <thead>
                  <th>Name</th>
                  <th>Duration</th>
                  <th>Start</th>
                  <th>End</th>
                </thead>
                <tbody>
                  {traces?.length === 0 ? (
                    <div className="font-bold text-neutral-200 flex items-center justify-center text-center mx-auto">
                      No traces found
                    </div>
                  ) : (
                    <>
                      {traces?.map((trace) => {
                        const isSelected = params.traceId === trace.id;
                        const rootSpan = trace.rootSpan;
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
                            className={`border-b-2 border-graphiql-neutral/10 text-neutral-100 hover:cursor-pointer`}
                            onClick={() => handleSelectTrace(trace)}
                          >
                            <th
                              className={classNames(
                                `px-6 py-4 whitespace-nowrap text-left font-medium ${
                                  isSelected ? "underline" : "font-bold"
                                }`,
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
                    </>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
