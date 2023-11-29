import { Trace } from "@graphql-debugger/types";

import { rootSpanName } from "./root-span-name";

export function traceNameIncludes(trace: Trace, searchValue: string): boolean {
  return rootSpanName({ trace })
    .toLowerCase()
    .includes(searchValue.toLowerCase().trim());
}
