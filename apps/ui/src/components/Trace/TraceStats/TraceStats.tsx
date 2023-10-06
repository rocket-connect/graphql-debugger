import { SchemaTraces } from "./SchemaTraces";
import { TraceViewer } from "./TraceViewer";

export const TraceStats = () => {
  return (
    <div className="flex flex-col w-full gap-8 h-full">
      <TraceViewer />
      <SchemaTraces />
    </div>
  );
};
