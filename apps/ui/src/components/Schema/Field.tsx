import { useQuery } from "@tanstack/react-query";

import { aggregateSpans } from "../../api/aggregate-spans";
import { FieldName } from "./FieldName";
import { Stats } from "./Stats";
import type { FieldProps } from "./types";
import { extractTypeName } from "./utils";

export const Field = ({
  field,
  parentName,
  schemaId,
  isLastField,
}: FieldProps) => {
  const name = field.name.value;
  const type = extractTypeName(field.type);

  const { data: aggregate } = useQuery({
    queryKey: ["aggregateSpans", name, schemaId, parentName],
    queryFn: async () =>
      await aggregateSpans({
        where: {
          name: `${parentName} ${name}`,
          schemaId,
        },
      }),
  });

  const shouldDisplayStats = ["query", "mutation"].includes(parentName);

  return (
    <li className={`ml-3 text-sm ${shouldDisplayStats ? "py-2" : ""}`}>
      <FieldName parentName={parentName} name={name} type={type} />
      {shouldDisplayStats && (
        <div className={`${isLastField ? "" : "py-2"}`}>
          <Stats aggregate={aggregate} />
        </div>
      )}
    </li>
  );
};
