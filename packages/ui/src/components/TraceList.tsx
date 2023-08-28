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
            const startTimeMillis = BigInt(rootSpan?.startTimeUnixNano || '') / BigInt(1000000);
            const startDate = new Date(Number(startTimeMillis));

            return (
              <tr key={trace.id} className="border-b" onClick={() => onSelect(trace)}>
                <th
                  scope="row"
                  className={`px-6 py-4 font-medium whitespace-nowrap ${
                    trace.id === params.traceId
                      ? 'text-graphql-otel-green font-bold underline underline-graphql-otel-green'
                      : ''
                  }å}`}
                >
                  {rootSpan?.name}
                </th>
                <td className="px-6 py-4">{rootSpan?.duration.toFixed(2)} ms</td>
                <td className="px-6 py-4">{moment(startDate).fromNow()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
