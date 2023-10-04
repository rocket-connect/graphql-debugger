import { IDS } from "../../testing";
import { JsonValue } from "./JsonValue";

export function JsonViewer({ json }: { json: string }) {
  const data = JSON.parse(json);

  if (!Object.keys(data).length) {
    return <></>;
  }

  return (
    <div
      id={IDS.JSON_VIEWER}
      data-json={json}
      className="flex-1 text-neutral-100"
    >
      <pre className="text-xs flex flex-col gap-5">
        <JsonValue value={data} />
      </pre>
    </div>
  );
}
