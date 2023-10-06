import { Trace } from "@graphql-debugger/types";

import { QueryViewer } from "./query-viewer/QueryViewer";

export const Query = ({ trace }: { trace?: Trace }) => {
  return (
    <div className="p-4">
      <h2 className="text-neutral-100 font-bold">Query</h2>
      <p className="text-neutral-100 text-xs mb-2">The issued GraphQL Query.</p>
      <div className="overflow-scroll custom-scrollbar ml-1">
        {trace?.rootSpan?.graphqlDocument && (
          <QueryViewer
            doc={trace?.rootSpan?.graphqlDocument}
            spanId={trace?.rootSpan?.id}
          />
        )}
      </div>
    </div>
  );
};
