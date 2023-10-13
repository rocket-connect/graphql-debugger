import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { client } from "../../client";
import { DEFAULT_SLEEP_TIME, sleep } from "../../utils/sleep";
import { Editor } from "./Editor/Editor";
import { SchemaTraces, TraceViewer } from "./TraceStats";
import { TraceHeader } from "./TraceStats/TraceHeader";

export const Trace = () => {
  const params = useParams();

  const { data: trace, isLoading } = useQuery({
    queryKey: ["singleTrace", params.traceId],
    queryFn: async () => {
      const trace = await client.trace.findMany({
        where: {
          id: params.traceId,
        },
        includeRootSpan: true,
      });

      await sleep(DEFAULT_SLEEP_TIME);

      return trace;
    },
    select: (data) => data[0],
    networkMode: "always",
  });

  return (
    <>
      <TraceHeader trace={trace} isLoading={isLoading} />
      <div className="flex flex-grow gap-4 h-96 items-center ">
        <Editor trace={trace} />
        <div className="flex flex-col basis-8/12 w-full gap-8 h-full">
          <TraceViewer />
          <SchemaTraces />
        </div>
      </div>
    </>
  );
};
