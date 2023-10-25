import { IDS } from "../..//testing";
import { Editor } from "./editor/editor";
import { TraceHeader } from "./header";
import { SchemaTraces } from "./traces";
import { TraceViewer } from "./viewer";

export function Trace() {
  return (
    <div
      id={IDS.trace.view}
      className="flex flex-col flex-grow w-full h-full gap-4"
    >
      <TraceHeader />
      <div className="flex flex-grow gap-4 h-96 items-center ">
        <Editor />
        <div className="flex flex-col basis-8/12 w-full gap-8 h-full">
          <TraceViewer />
          <SchemaTraces />
        </div>
      </div>
    </div>
  );
}
