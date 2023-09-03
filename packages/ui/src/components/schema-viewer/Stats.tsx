import { AggregateSpansResponse } from '../../graphql-types';
import { UnixNanoTimeStamp } from '@graphql-debugger/time';

export function Stats({ aggregate }: { aggregate: AggregateSpansResponse | null }) {
  const lastResolveUnixNano = UnixNanoTimeStamp.fromString(aggregate?.lastResolved || '0');
  const averageDurationUnixNano = UnixNanoTimeStamp.fromString(aggregate?.averageDuration || '0');

  return (
    <div className="pl-2 text-xs font-light text-graphiql-light">
      <ul className="list-disc list-inside marker:text-graphql-otel-green flex flex-col gap-2 ">
        <li>
          Resolve Count: <span className="font-bold">{aggregate?.resolveCount}</span>
        </li>
        <li>
          Error Count: <span className="font-bold text-red-500">{aggregate?.errorCount}</span>
        </li>
        <li>
          Average Duration: <span className="font-bold">{averageDurationUnixNano.toMS()} ms</span>
        </li>
        <li>
          Last Resolved:{' '}
          <span className="font-bold">{lastResolveUnixNano.toTimeStamp().moment.fromNow()}</span>
        </li>
      </ul>
    </div>
  );
}
