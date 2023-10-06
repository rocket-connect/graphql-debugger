import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { listTraceGroups } from "../../api/list-trace-groups";
import { Editor } from "./Editor/Editor";
import { TraceHeader } from "./TraceStats/TraceHeader";
import { TraceStats } from "./TraceStats/TraceStats";

export const Trace = () => {
  const params = useParams();

  const { data: trace } = useQuery({
    queryKey: ["singleTrace", params.traceId],
    queryFn: async () =>
      await listTraceGroups({
        where: {
          id: params.traceId,
        },
        includeRootSpan: true,
      }),
    select: (data) => data[0],
  });

  return (
    <div className="flex flex-col gap-4 bg-neutral/5 p-5 rounded-2xl w-full h-full mx-4">
      <TraceHeader trace={trace} />
      <div className="flex flex-grow gap-4  h-96 items-center ">
        <Editor trace={trace} />
        <TraceStats />
      </div>
    </div>
  );
};
