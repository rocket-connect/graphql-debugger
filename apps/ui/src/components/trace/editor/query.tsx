import { Trace } from "@graphql-debugger/types";

import { QueryViewer } from "./query/viewer";

export function Query({ trace }: { trace?: Trace }) {
  return (
    <div className="p-4 text-neutral-100">
      <h2 className="font-bold">Query</h2>
      <p className="text-xs mb-2">The issued GraphQL Query.</p>
      <div className="overflow-scroll custom-scrollbar ml-1">
        {trace?.rootSpan?.graphqlDocument && <QueryViewer trace={trace} />}
      </div>
    </div>
  );
}
