import { Trace } from "@graphql-debugger/types";

import { useContext } from "react";

import { SchemasContext } from "../../context/schemas";
import { IDS } from "../../testing";
import { logo } from "../../utils/images";
import { Pill } from "./pill";

export function TraceHeader({ trace }: { trace?: Trace }) {
  const schemaContext = useContext(SchemasContext);

  return (
    <div
      id={IDS.trace.header}
      className="flex items-center justify-between gap-2 text-sm text-neutral"
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
        <p className="my-auto text-xl text-neutral font-bold">
          GraphQL Debugger
        </p>
      </a>
    </div>
  );
}
