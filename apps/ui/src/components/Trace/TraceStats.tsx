import { TraceViewer } from "../trace-viewer/TraceViewer";
import { SchemaTraces } from "./SchemaTraces";

export const TraceStats = () => {
  return (
    <div className="flex flex-col w-full gap-8 h-full">
      <TraceViewer />
      <SchemaTraces />
    </div>
  );
};
