import type { AggregateSpansResponse } from "@graphql-debugger/types";

import { useEffect, useState } from "react";

import { aggregateSpans } from "../../api/aggregate-spans";
import { FieldName } from "./FieldName";
import { Stats } from "./Stats";
import type { FieldProps } from "./types";
import { extractTypeName } from "./utils";

export const Field = ({ field, parentName, schemaId }: FieldProps) => {
  const name = field.name.value;
  const type = extractTypeName(field.type);
  const [aggregate, setAggregate] = useState<AggregateSpansResponse | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      try {
        const _aggregate = await aggregateSpans({
          where: {
            name: `${parentName} ${name}`,
            schemaId,
          },
        });

        setAggregate(_aggregate);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [name, schemaId, parentName]);

  return (
    <li className="ml-2 p-0.5 text-s">
      <FieldName parentName={parentName} name={name} type={type} />
      {["query", "mutation"].includes(parentName) && (
        <div className="py-2">
          <Stats aggregate={aggregate} />
        </div>
      )}
    </li>
  );
};
