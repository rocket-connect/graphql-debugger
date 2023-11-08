import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useParams } from "react-router-dom";

import { ClientContext } from "../../../context/client";
import { IDS } from "../../../testing";
import { Query } from "./query";
import { Variables } from "./variables";

export function Editor() {
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
      id={IDS.trace.editor}
      className="flex flex-col h-full justify-between basis-5/12 bg-primary-background divide-y-2 divide-neutral/10 w-5/12 rounded-2xl"
    >
      <Query trace={trace} />
      <Variables trace={trace} />
    </div>
  );
}
