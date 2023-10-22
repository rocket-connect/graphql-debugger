import { UnixNanoTimeStamp } from "@graphql-debugger/time";
import { Trace } from "@graphql-debugger/types";

import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useContext } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { ClientContext, HistoryTrace } from "../../context/client";
import { Modal } from "../../context/modal";
import { Star, StarFilled } from "../../icons/star";
import { refresh, searchFilled } from "../../images";
import { IDS } from "../../testing";
import { DEFAULT_SLEEP_TIME, sleep } from "../../utils/sleep";
import { OpenModal } from "../modal/open";
import { ModalWindow } from "../modal/window";
import { Spinner } from "../utils/spinner";
import { Search } from "./search";

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

  const { data: traces, isLoading } = useQuery({
    queryKey: [
      "traces",
      params.schemaId,
      searchParams.get("rootSpanName"),
      params.traceId,
    ],
    queryFn: async () => {
      const traces = await client.trace.findMany({
        where: {
          schemaId: params.schemaId,
          rootSpanName: searchParams.get("rootSpanName"),
        },
        includeRootSpan: true,
      });

      await sleep(DEFAULT_SLEEP_TIME);

      return traces;
    },
  });

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
        <p>
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
        schemaId: params.schemaId,
      });
      toast.success(
        <p>
          Added
          <span className="font-bold px-2">{trace?.rootSpan?.name}</span>
          to favourites
        </p>,
      );
    }
  };

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
          <Modal key="search-full-screen">
            <OpenModal opens="full-screen-search">
              <button className="flex gap-3 hover:underline" onClick={() => {}}>
                <img className="w-6" src={searchFilled} />
                <p>Search</p>
              </button>
            </OpenModal>
            <ModalWindow
              name="full-screen-search"
              type="small"
              title={<div className="text-neutral-100 font-bold">Search</div>}
            >
              <Search />
            </ModalWindow>
          </Modal>

          <button
            className="flex gap-3 hover:underline"
            onClick={() => {
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
                          >
                            <th
                              className={classNames(
                                `px-6 py-4  flex items-center gap-3 `,
                              )}
                              role="button"
                            >
                              <button onClick={() => handleAddTrace(trace)}>
                                {isFavourite(trace.id) ? (
                                  <Star />
                                ) : (
                                  <StarFilled />
                                )}
                              </button>
                              <Link
                                className={classNames(
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
                                    schemaId: params.schemaId ?? "",
                                    uniqueId: uuidv4(),
                                  })
                                }
                              >
                                {rootSpan?.name}
                              </Link>
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
