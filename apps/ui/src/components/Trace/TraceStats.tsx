import { SchemaTraces } from "./SchemaTraces";

export const TraceStats = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="basis-1/2">Trace Graph here</div>
      <SchemaTraces />
    </div>
  );
};
