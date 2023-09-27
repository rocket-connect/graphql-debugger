import type { AggregateSpansResponse } from "@graphql-debugger/types";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { aggregateSpans } from "../../api/aggregate-spans";
import { Stats } from "./Stats";
import type { FieldProps } from "./types";
import  classNames  from 'classnames'
import { extractTypeName } from "./utils";

const processedType = (type: string) => {
  return Array.from(type).map((char, index) => {
    if (["!", "[", "]"].includes(char)) {
      return (
        <span key={index} className="text-neutral-100">
          {char}
        </span>
      );
    }
    return char;
  })}

  const renderFieldName = (parentName: string, name: string) => {
  const [searchParams] = useSearchParams();
    const rootSpanName = searchParams.get("rootSpanName");
    const navigate = useNavigate();
    if (["query", "mutation"].includes(parentName)) {
      const _rootSpanName = `${parentName} ${name}`;
      return (
        <span
          className={classNames('text-md text-neutral-100 hover:cursor-pointer', {
            ['font-medium decoration-graphiql-pink']: rootSpanName === _rootSpanName
          })}
          onClick={() => {
            navigate(
              `?${new URLSearchParams({
                rootSpanName: _rootSpanName,
              }).toString()}`,
            );
          }}
        >
          {name}:
        </span>
      );
    } else {
      return <span className="text-neutral-100">{name}:</span>;
    }
  };


export function Field({ field, parentName, schemaId }: FieldProps) {
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
      <div className="flex items-center gap-2 text-s">
        {renderFieldName(parentName, field.name.value)}
        <span className="text-secondary-blue">{processedType(type)}</span>
      </div>
      {["query", "mutation"].includes(parentName) && (
        <div className="py-2">
          <Stats aggregate={aggregate} />
        </div>
      )}
    </li>
  );
}
