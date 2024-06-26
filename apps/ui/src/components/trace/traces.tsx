import { Trace } from "@graphql-debugger/types";
import { getTraceStart, sumTraceTime } from "@graphql-debugger/utils";

import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { DEMO_MODE } from "../../config";
import { ClientContext } from "../../context/client";
import { demoTraces } from "../../demo/traces";
import { RefreshIcon } from "../../icons/refresh";
import { Star, StarFilled } from "../../icons/star";
import { IDS } from "../../testing";
import { cn } from "../../utils/cn";
import { traceNameIncludes } from "../../utils/find-traces";
import { isTraceError } from "../../utils/is-trace-error";
import { rootSpanName } from "../../utils/root-span-name";
import { SearchBox } from "../search-box";
import { Spinner } from "../utils/spinner";

export function SchemaTraces() {
  const {
    client,
    handleSetHistoryTraces,
    favourites,
    handleSetFavourites,
    handleDeleteFavouriteTrace,
  } = useContext(ClientContext);
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const { data: traces, isLoading } = useQuery({
    queryKey: ["traces", params.schemaId, searchParams.get("rootSpanName")],
    queryFn: async () => {
      const rootSpanName = searchParams.get("rootSpanName");

      if (DEMO_MODE) {
        if (rootSpanName) {
          return demoTraces.filter((trace) => {
            return trace?.rootSpan?.name.includes(rootSpanName);
          });
        }

        return demoTraces;
      }

      const traces = await client.trace.findMany({
        where: {
          schemaId: params.schemaId,
          rootSpanName: searchParams.get("rootSpanName"),
        },
        includeRootSpan: true,
        includeSpans: true,
      });

      return traces;
    },
  });

  const filteredTraces = useMemo(
    () => traces?.filter((trace) => traceNameIncludes(trace, search)),
    [traces, search],
  );

  const isFavourite = (traceId: string): boolean => {
    return (
      favourites.find((fav) => fav.trace.id === traceId)?.trace.id === traceId
    );
  };

  const isSelected = (traceId: string): boolean => {
    return params.traceId === traceId;
  };

  const handleAddTrace = (trace: Trace) => {
    if (isFavourite(trace.id)) {
      toast.error(
        <p className="text-sm">
          Removed
          <span className="font-bold px-2">{trace?.rootSpan?.name}</span>
          from favourites
        </p>,
      );
      handleDeleteFavouriteTrace(trace.id);
    }
    if (!isFavourite(trace.id)) {
      handleSetFavourites({
        trace,
        schemaId: params.schemaId as string,
        uniqueId: uuidv4(),
        timestamp: new Date(),
      });
      toast.success(
        <p className="text-sm">
          Added
          <span className="font-bold px-2">{trace?.rootSpan?.name}</span>
          to favourites
        </p>,
      );
    }
  };

  return (
    <div
      className="bg-primary-background flex-grow flex-shrink-0 basis-1/3 rounded-2xl divide-y-2 divide-accent"
      id={IDS.trace_list.view}
    >
      <div className="flex items-center p-5 justify-between text-neutral">
        <div className="flex flex-col">
          <p className="text-md font-bold">Traces</p>
          <p className="text-sm">List of the latest GraphQL queries.</p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <SearchBox
            handleSearch={(value) => setSearch(value)}
            searchValue={search}
          />
          <button
            className="flex gap-3 items-center  hover:underline"
            onClick={() => {
              navigate({
                pathname: `/schema/${params.schemaId}`,
                search: "",
              });
            }}
          >
            <RefreshIcon height={20} width={20} />
            <p>Refresh</p>
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="max-h-[245px] overflow-y-scroll custom-scrollbar w-full">
          {isLoading ? (
            <div className="flex align-center justify-center mx-auto mt-20">
              <Spinner />
            </div>
          ) : (
            <>
              {filteredTraces?.length === 0 ? (
                <div
                  id={IDS.trace_list.not_found}
                  className="mx-auto text-center text-neutral font-bold"
                >
                  <p className="mt-20">No Traces Found</p>
                </div>
              ) : (
                <table
                  id={IDS.trace_list.table}
                  className="w-full text-xs text-center"
                >
                  <thead>
                    <tr>
                      <th className="px-6 text-left">Name</th>
                      <th>Duration</th>
                      <th>Start</th>
                      <th>Favourite</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTraces?.map((trace) => {
                      const startTimeUnixNano = getTraceStart(trace);
                      const traceDurationUnixNano =
                        trace && sumTraceTime(trace);

                      const traceDurationSIUnits =
                        traceDurationUnixNano?.toSIUnits();

                      const { value, unit } = traceDurationSIUnits;

                      const isError = isTraceError(trace);

                      return (
                        <tr
                          data-traceid={trace?.id}
                          key={trace.id}
                          className={`border-b-2 border-b-accent text-neutral hover:cursor-pointer`}
                        >
                          <th
                            className={`py-4 ${
                              isError ? "text-red" : ""
                            } text-left`}
                            role="button"
                          >
                            <Link
                              className={cn(
                                `px-6 py-4 whitespace-nowrap font-medium ${
                                  isSelected(trace.id)
                                    ? "underline"
                                    : "font-bold"
                                }`,
                              )}
                              to={`/schema/${params.schemaId}/trace/${
                                trace.id
                              }?${searchParams.toString()}`}
                              onClick={() =>
                                handleSetHistoryTraces({
                                  trace,
                                  schemaId: params.schemaId as string,
                                  uniqueId: uuidv4(),
                                  timestamp: new Date(),
                                })
                              }
                            >
                              {rootSpanName({
                                trace,
                              })}
                            </Link>
                          </th>
                          <td className="px-6 py-4">{`${value.toFixed(
                            2,
                          )} ${unit}`}</td>
                          <td className="px-6 py-4">
                            {startTimeUnixNano.formatUnixNanoTimestamp()}
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => handleAddTrace(trace)}>
                              {isFavourite(trace.id) ? (
                                <Star height={20} width={20} />
                              ) : (
                                <StarFilled height={20} width={20} />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
