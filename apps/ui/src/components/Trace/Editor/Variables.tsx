import { Trace } from "@graphql-debugger/types";

import classNames from "classnames";
import { useState } from "react";

import { DownArrow, UpArrow } from "../../../icons";
import { JsonViewer } from "./json-viewer/JsonViewer";
import { jsonMapper, metaMapper, variablesHeader } from "./utils";

export const Variables = ({ trace }: { trace?: Trace }) => {
  const [selectedMeta, setSelectedMeta] = useState<string>("variables");
  const [displayVariables, setDisplayVariables] = useState(false);

  const handleMetaClick = (event: HTMLDivElement) => {
    setSelectedMeta(event.innerHTML.toLowerCase());
  };

  const errorsJson = JSON.stringify(
    (trace?.spans || []).reduce((result, span) => {
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
    <div className="flex p-4 flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {variablesHeader.map((variable) => (
            <p
              key={variable}
              onClick={(event) =>
                handleMetaClick(event.target as HTMLDivElement)
              }
              className={classNames("text-neutral-100 ", {
                ["font-semibold"]: selectedMeta === variable.toLowerCase(),
              })}
              role="button"
            >
              {variable}
            </p>
          ))}
        </div>
        {displayVariables ? (
          <button onClick={() => setDisplayVariables(false)}>
            <DownArrow />
          </button>
        ) : (
          <button onClick={() => setDisplayVariables(true)}>
            <UpArrow />
          </button>
        )}
      </div>
      {displayVariables && (
        <div
          className={classNames({
            ["h-96"]: displayVariables,
          })}
        >
          <p className="text-xs">{metaMapper[selectedMeta]}</p>
          <div className="overflow-scroll custom-scrollbar h-full">
            <JsonViewer
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
};