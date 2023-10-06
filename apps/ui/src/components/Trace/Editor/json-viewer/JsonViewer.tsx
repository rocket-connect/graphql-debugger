import { JsonValue } from "./JsonValue";

export function JsonViewer({ json, id }: { json: string; id: string }) {
  const data = JSON.parse(json);

  if (!Object.keys(data).length) {
    return <></>;
  }

  return (
    <div id={id} data-json={json} className="flex-1 text-neutral-100">
      <pre className="text-xs flex flex-col gap-5">
        <JsonValue value={data} />
      </pre>
    </div>
  );
}
