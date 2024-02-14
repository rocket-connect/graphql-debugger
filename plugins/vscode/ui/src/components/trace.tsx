import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";

import { ClientContext } from "../context/client";
import { Editor } from "./editor";
import { SchemaTraces } from "./schema-traces";
import { TraceViewer } from "./trace-viewer";

export function Trace(
  props: React.PropsWithChildren<{
    schemaId: string;
  }>,
) {
  const { client } = useContext(ClientContext);
  const [traceId, setTraceId] = React.useState<string | undefined>();

  const { data: trace } = useQuery({
    queryKey: ["singleTrace", props.schemaId, traceId],
    queryFn: async () => {
      if (!props.schemaId && !traceId) {
        return [];
      }

      const trace = await client.trace.findMany({
        where: {
          id: traceId,
          schemaId: props.schemaId,
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
    <div className="flex flex-col flex-grow w-full h-full gap-4">
      <div className="flex flex-grow gap-4 h-96 items-center ">
        <Editor traceId={traceId} />
        <div className="flex flex-col flex-1 basis-8/12 w-full gap-4 h-full">
          <TraceViewer trace={trace} />
          <SchemaTraces
            schemaId={props.schemaId as string}
            setTraceId={(id: string) => setTraceId(id)}
          />
        </div>
      </div>
    </div>
  );
}
