import { Trace } from 'src/graphql-types';
import moment from 'moment';
import { useParams } from 'react-router-dom';

export function TraceList({
  traces,
  onSelect,
}: {
  traces: Trace[];
  onSelect: (trace: Trace) => void;
}) {
  const params = useParams();
  return (
    <div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Duration
            </th>
            <th scope="col" className="px-6 py-3">
              When
            </th>
          </tr>
        </thead>
        <tbody>
          {traces.map((trace) => {
            const rootSpan = trace.rootSpan;
            const errorMessage = trace?.firstSpanErrorMessage;
            const startTimeMillis = BigInt(rootSpan?.startTimeUnixNano || 0) / BigInt(1000000);
            const startDate = new Date(Number(startTimeMillis));
            const isSelected = trace.id === params.traceId;

            let traceClasses = 'absolute h-3 ';
            if (isSelected) {
              traceClasses += ' font-bold underline';
            }

            if (errorMessage) {
              traceClasses += ' text-red-500 underline-graphql-otel-red-500';
            } else {
              traceClasses += ' text-green-500 underline-graphql-otel-green';
            }

            return (
              <tr key={trace.id} className="border-b" onClick={() => onSelect(trace)}>
                <th
                  scope="row"
                  className={`px-6 py-4 font-medium whitespace-nowrap ${traceClasses}`}
                >
                  {rootSpan?.name}
                </th>
                <td className="px-6 py-4">
                  {Number(BigInt(rootSpan?.durationNano || 0) / BigInt(1000000)).toFixed(2)} ms
                </td>
                <td className="px-6 py-4">{moment(startDate).fromNow()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
