import { Trace } from "@graphql-debugger/types";

import { Query } from "./query";
import { Variables } from "./variables";

export function Editor({ trace }: { trace?: Trace }) {
  return (
    <div className="flex flex-col h-full justify-between basis-5/12 bg-white-100 divide-y-2 divide-neutral/10 w-5/12 rounded-2xl">
      <Query trace={trace} />
      <Variables trace={trace} />
    </div>
  );
}
