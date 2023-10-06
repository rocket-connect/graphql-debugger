import { SchemaTraces } from "./SchemaTraces";
import { TraceViewer } from "./TraceViewer";

export const TraceStats = () => {
  return (
    <div className="flex flex-col basis-8/12 w-full gap-8 h-full">
      <TraceViewer />
      <SchemaTraces />
    </div>
  );
};
