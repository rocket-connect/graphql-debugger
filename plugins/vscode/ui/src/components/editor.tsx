import { Query } from "@graphql-debugger/ui/src/components/trace/editor/query";
import { Variables } from "@graphql-debugger/ui/src/components/trace/editor/variables";

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { ClientContext } from "../context/client";

export function Editor(props: React.PropsWithChildren<{ traceId?: string }>) {
  const { client } = useContext(ClientContext);

  const { data: trace } = useQuery({
    queryKey: ["singleTrace", props.traceId],
    queryFn: async () => {
      if (!props.traceId) {
        return [];
      }

      const trace = await client.trace.findMany({
        where: {
          id: props.traceId,
        },
        includeRootSpan: true,
      });

      return trace;
    },
    select: (data) => data[0],
    networkMode: "always",
  });

  return (
    <div className="flex flex-col h-full justify-between basis-5/12 bg-primary-background divide-y-2 divide-accent w-5/12 rounded-2xl">
      <Query trace={trace} />
      <Variables trace={trace} />
    </div>
  );
}
