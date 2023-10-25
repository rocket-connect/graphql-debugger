import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useParams } from "react-router-dom";

import { ClientContext } from "../../context/client";
import { SchemasContext } from "../../context/schemas";
import { IDS } from "../../testing";
import { logo } from "../../utils/images";
import { Pill } from "./pill";

export function TraceHeader() {
  const schemaContext = useContext(SchemasContext);

  const { client } = useContext(ClientContext);
  const params = useParams();

  const { data: trace } = useQuery({
    queryKey: ["singleTrace", params.traceId],
    queryFn: async () => {
      if (!params.traceId) {
        return [];
      }

      const trace = await client.trace.findMany({
        where: {
          id: params.traceId,
        },
        includeRootSpan: true,
      });

      return trace;
    },
    select: (data) => data[0],
    networkMode: "always",
  });

  return (
    <div
      id={IDS.trace.header}
      className="flex items-center justify-between gap-2 text-sm text-neutral-100"
    >
      <Pill trace={trace} />
      <a
        className="flex flex-row gap-2 py-1 hover:cursor-pointer"
        href=""
        onClick={() => {
          schemaContext?.setSelectedSchema(undefined);
        }}
      >
        <img className="w-10 my-auto" src={logo}></img>
        <p className="my-auto text-xl text-neutral-100 font-bold">
          GraphQL Debugger
        </p>
      </a>
    </div>
  );
}
