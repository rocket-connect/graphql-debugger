import { Spinner } from "@graphql-debugger/ui/src/components/utils/spinner";
import {
  getTraceStart,
  isTraceError,
  sumTraceTime,
} from "@graphql-debugger/utils";

import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";

import { ClientContext } from "../context/client";

export function SchemaTraces(
  props: React.PropsWithChildren<{
    schemaId: string;
    traceId?: string;
    setTraceId: (id: string) => void;
  }>,
) {
  const { client } = useContext(ClientContext);

  const { data: traces, isLoading } = useQuery({
    queryKey: ["traces", props.schemaId, props.traceId],
    queryFn: async () => {
      const traces = await client.trace.findMany({
        where: {
          schemaId: props.schemaId,
        },
        includeRootSpan: true,
        includeSpans: true,
      });

      return traces;
    },
  });

  return (
    <div className="bg-primary-background flex-grow flex-shrink-0 basis-1/3 rounded-2xl divide-y-2 divide-accent">
      <div className="flex items-center p-5 justify-between text-neutral">
        <div className="flex flex-col">
          <p className="text-md font-bold">Traces</p>
          <p className="text-sm">List of the latest GraphQL queries.</p>
        </div>
        <div className="flex items-center gap-5 text-sm"></div>
      </div>
      <div className="p-5">
        <div className="max-h-[245px] overflow-y-scroll custom-scrollbar w-full">
          {isLoading ? (
            <div className="flex align-center justify-center mx-auto mt-20">
              <Spinner />
            </div>
          ) : (
            <>
              {traces?.length === 0 ? (
                <div className="mx-auto text-center text-neutral font-bold">
                  <p className="mt-20">No Traces Found</p>
                </div>
              ) : (
                <table className="w-full text-xs text-center">
                  <thead>
                    <tr>
                      <th className="px-6 text-left">Name</th>
                      <th>Duration</th>
                      <th>Start</th>
                    </tr>
                  </thead>

                  <tbody>
                    {traces?.map((trace) => {
                      const startTimeUnixNano = getTraceStart(trace);
                      const traceDurationUnixNano =
                        trace && sumTraceTime(trace);

                      const traceDurationSIUnits =
                        traceDurationUnixNano?.toSIUnits();

                      const { value, unit } = traceDurationSIUnits;

                      const isError = isTraceError(trace);

                      return (
                        <tr
                          onClick={() => props.setTraceId(trace.id)}
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
                            {trace.rootSpan?.name}
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
