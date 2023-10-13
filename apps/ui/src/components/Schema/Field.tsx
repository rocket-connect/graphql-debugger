import { FieldName } from "./field-name";
import { Stats } from "./stats";
import type { FieldProps } from "./types";
import { extractTypeName } from "./utils";

export function Field({ field, parentName, isLastField }: FieldProps) {
  const name = field.name.value;
  const type = extractTypeName(field.type);

  const shouldDisplayStats = ["query", "mutation"].includes(parentName);

  return (
    <li className={`ml-3 text-sm ${shouldDisplayStats ? "py-2" : ""}`}>
      <FieldName parentName={parentName} name={name} type={type} />
      {shouldDisplayStats && (
        <div className={`${isLastField ? "" : "py-2"}`}>
          <Stats field={field} parentName={parentName} />
        </div>
      )}
    </li>
  );
}
