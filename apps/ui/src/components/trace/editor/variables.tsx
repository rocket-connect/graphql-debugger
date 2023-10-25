import { Trace } from "@graphql-debugger/types";

import classNames from "classnames";
import { useState } from "react";

import { IDS } from "../../../testing";
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

  const errorsJson = JSON.stringify(
    [
      ...(trace?.spans || []),
      ...(trace?.rootSpan ? [trace?.rootSpan] : []),
    ].reduce((result, span) => {
      if (span.errorMessage || span.errorStack) {
        result[span.name] = {
          errorMessage: span.errorMessage,
          errorStack: span.errorStack,
        };
      }

      return result;
    }, {}),
  );

  return (
    <div className="flex p-4 flex-col gap-2 justify-between text-neutral-100">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {variablesHeader.map((variable) => (
            <p
              key={variable}
              onClick={(event) =>
                handleMetaClick(event.target as HTMLDivElement)
              }
              {...(variable === "Result"
                ? {
                    id: IDS.trace.switch_view,
                  }
                : {})}
              className={classNames("text-neutral-100 ", {
                ["font-semibold"]: selectedMeta === variable.toLowerCase(),
              })}
              role="button"
            >
              {variable}
            </p>
          ))}
        </div>
      </div>
      {displayVariables && (
        <div className="flex flex-col gap-2">
          <p className="text-sm">{metaMapper[selectedMeta]}</p>
          <div className="h-96 w-96 overflow-scroll custom-scrollbar">
            <JsonViewer
              id={selectedMeta === "result" ? IDS.trace.json_viewer : ""}
              json={
                selectedMeta === "errors"
                  ? errorsJson
                  : trace?.rootSpan?.[jsonMapper[selectedMeta]] || "{}"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
