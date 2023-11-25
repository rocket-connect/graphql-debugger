import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useParams } from "react-router-dom";

import { ClientContext } from "../../context/client";
import { IDS } from "../../testing";
import { Editor } from "./editor/editor";
import { TraceHeader } from "./header";
import { SchemaTraces } from "./traces";
import { TraceViewer } from "./viewer";

export function Trace() {
  const { client } = useContext(ClientContext);
  const params = useParams();

  const { data: trace } = useQuery({
    queryKey: ["singleTrace", params.traceId, params.schemaId],
    queryFn: async () => {
      if (!params.traceId || !params.schemaId) {
        return [];
      }

      const trace = await client.trace.findMany({
        where: {
          id: params.traceId,
          schemaId: params.schemaId,
        },
        includeRootSpan: true,
        includeSpans: true,
      });

      return trace;
    },
    select: (data) => data[0],
    networkMode: "always",
  });

  return (
    <div
      id={IDS.trace.view}
      className="flex flex-col flex-grow w-full h-full gap-4"
    >
      <TraceHeader trace={trace} />
      <div className="flex flex-grow gap-4 h-96 items-center ">
        <Editor />
        <div className="flex flex-col flex-1 basis-8/12 w-full gap-4 h-full">
          <TraceViewer trace={trace} />
          <SchemaTraces />
        </div>
      </div>
    </div>
  );
}
