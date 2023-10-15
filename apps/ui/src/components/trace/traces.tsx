import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { Trace } from "@graphql-debugger/types";

import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { ClientContext } from "../../context/client";
import { refresh, searchFilled } from "../../images";
import { IDS } from "../../testing";
import { DEFAULT_SLEEP_TIME, sleep } from "../../utils/sleep";
import { Spinner } from "../utils/spinner";

export function SchemaTraces() {
  const { client } = useContext(ClientContext);
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [selectedTrace, setSelectedTrace] = useState<Trace | undefined>(
    undefined,
  );

  const { data: traces, isLoading } = useQuery({
    queryKey: ["traces", params.schemaId, searchParams.get("rootSpanName")],
    queryFn: async () => {
      const _traces = await client.trace.findMany({
        where: {
          schemaId: params.schemaId,
          rootSpanName: searchParams.get("rootSpanName"),
        },
        includeRootSpan: true,
      });

      await sleep(DEFAULT_SLEEP_TIME);

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

    if (selectedTrace && params.traceId) {
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
        <div className="flex items-center gap-10 text-sm">
          <button className="flex gap-3 hover:underline" onClick={() => {}}>
            <img className="w-6" src={searchFilled} />
            <p>Search</p>
          </button>

          <button
            className="flex gap-3 hover:underline"
            onClick={() => {
              setSelectedTrace(undefined);
              navigate({
                pathname: `/schema/${params.schemaId}`,
                search: "",
              });
            }}
          >
            <img className="w-6" src={refresh} />
            <p>Refresh</p>
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="h-96 overflow-y-scroll custom-scrollbar w-full">
          {isLoading ? (
            <div className="flex align-center justify-center mx-auto mt-20">
              <Spinner />
            </div>
          ) : (
            <>
              <table className="w-full text-xs text-center">
                <thead>
                  <th>Name</th>
                  <th>Duration</th>
                  <th>Start</th>
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
                                `px-6 py-4 whitespace-nowrap font-medium ${
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
}
