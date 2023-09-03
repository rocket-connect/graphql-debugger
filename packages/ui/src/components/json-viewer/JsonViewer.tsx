import { JsonValue } from './JsonValue';

export function JsonViewer({ json }: { json: string }) {
  const data = JSON.parse(json);

  if (!Object.keys(data).length) {
    return <></>;
  }

  return (
    <div className="flex-1 overflow-y-auto text-graphiql-light">
      <pre className="text-xs flex flex-col gap-5">
        <JsonValue value={data} />
      </pre>
    </div>
  );
}
