import { RenderTree, ms } from './utils';

export function Span({
  data,
  minTimestamp,
  maxTimestamp,
  selectedSpanId,
}: {
  data: RenderTree;
  minTimestamp: number;
  maxTimestamp: number;
  selectedSpanId?: string;
}) {
  let width, offset;

  const calculatedWidth =
    (Number(BigInt(data.durationNano) / ms) / (maxTimestamp - minTimestamp)) * 100;
  width = calculatedWidth < 5 ? '5%' : `${calculatedWidth}%`;

  const calculatedOffset =
    ((Number(BigInt(data.startTimeUnixNano) / ms) - minTimestamp) / (maxTimestamp - minTimestamp)) *
    100;
  offset = calculatedOffset < 0 ? '0%' : `${calculatedOffset}%`;

  let spanClasses = 'absolute h-2';
  if (data.errorMessage) {
    spanClasses += ' bg-red-500';
  } else {
    spanClasses += ' bg-graphql-otel-green';
  }

  return (
    <div className="relative overflow-hidden flex flex-col gap-1 text-xs">
      <div className="py-4">
        <p className={`${data.errorMessage || data.errorStack ? 'text-red-500' : {}} py-1`}>
          {data.name}{' '}
          <span className="font-light">
            {Number(BigInt(data?.durationNano || 0) / BigInt(1000000)).toFixed(2)} ms
          </span>
        </p>
        <div className={`absolute h-2 bg-graphiql-border w-full`}></div>
        <div className={spanClasses} style={{ width, left: offset }}></div>
      </div>

      <div className="text-white flex flex-col p-0 m-0">
        {Array.isArray(data.children)
          ? data.children.map((child) => (
              <Span
                key={child.id}
                data={child}
                minTimestamp={minTimestamp}
                maxTimestamp={maxTimestamp}
                selectedSpanId={selectedSpanId}
              />
            ))
          : null}
      </div>
    </div>
  );
}
