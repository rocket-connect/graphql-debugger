import { Trace } from "@graphql-debugger/types";
import { printTraceErrors } from "@graphql-debugger/utils";

import { useState } from "react";

import { IDS } from "../../../testing";
import { cn } from "../../../utils/cn";
import {
  jsonMapper,
  metaMapper,
  variablesHeader,
} from "../../../utils/mappers";
import { JsonViewer } from "./json/viewer";

export function Variables({ trace }: { trace?: Trace }) {
  const [selectedMeta, setSelectedMeta] = useState<string>("variables");
  const [displayVariables, setDisplayVariables] = useState(false);

  const handleMetaClick = (event: HTMLDivElement) => {
    setSelectedMeta(event.innerHTML.toLowerCase());

    setDisplayVariables((x) => {
      if (event.innerHTML.toLowerCase() === selectedMeta && x === true) {
        return false;
      } else {
        return true;
      }
    });
  };

  const errors = JSON.parse(
    trace ? printTraceErrors(trace) : JSON.stringify({}),
  );

  return (
    <div
      id={IDS.trace.variables}
      className="flex p-4 flex-col gap-2 justify-between text-neutral-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {variablesHeader.map((variable) => (
            <a
              key={variable}
              onClick={(event) =>
                handleMetaClick(event.target as HTMLDivElement)
              }
              className={cn("text-neutral-100 ", {
                ["font-semibold"]: selectedMeta === variable.toLowerCase(),
              })}
              role="button"
            >
              {variable}
            </a>
          ))}
        </div>
      </div>
      {displayVariables && (
        <div className="flex flex-col gap-2">
          <p className="text-sm">{metaMapper[selectedMeta]}</p>
          <div className="h-96 w-96 overflow-scroll custom-scrollbar">
            <JsonViewer
              json={
                selectedMeta === "errors"
                  ? JSON.stringify(errors)
                  : trace?.rootSpan?.[jsonMapper[selectedMeta]] || "{}"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
