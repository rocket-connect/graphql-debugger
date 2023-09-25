import type { AggregateSpansResponse } from "@graphql-debugger/types";

import { FieldDefinitionNode } from "graphql";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { aggregateSpans } from "../../api/aggregate-spans";
import { Stats } from "./Stats";

function extractTypeName(typeNode): string {
  if (typeNode.kind === "NamedType") {
    return typeNode.name.value;
  }
  if (typeNode.kind === "ListType") {
    return `[${extractTypeName(typeNode.type)}]`;
  }
  if (typeNode.kind === "NonNullType") {
    return `${extractTypeName(typeNode.type)}!`;
  }

  return "";
}

export function Field({
  field,
  parentName,
  schemaId,
}: {
  field: FieldDefinitionNode;
  parentName: string;
  schemaId: string;
}) {
  const [searchParams] = useSearchParams();
  const rootSpanName = searchParams.get("rootSpanName");
  const navigate = useNavigate();
  const name = field.name.value;
  const type = extractTypeName(field.type);
  const [aggregate, setAggregate] = useState<AggregateSpansResponse | null>(
    null,
  );

  const processedType = Array.from(type).map((char, index) => {
    if (["!", "[", "]"].includes(char)) {
      return (
        <span key={index} className="text-white">
          {char}
        </span>
      );
    }
    return char;
  });

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

  const renderFieldName = () => {
    if (["query", "mutation"].includes(parentName)) {
      const _rootSpanName = `${parentName} ${name}`;
      return (
        <span
          className={`text-graphiql-light underline hover:cursor-pointer ${
            rootSpanName === _rootSpanName
              ? "font-bold decoration-graphiql-pink"
              : ""
          }`}
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
      return <span className="text-graphiql-light">{name}:</span>;
    }
  };

  return (
    <li className="ml-2 p-2">
      <div className="flex items-center">
        {renderFieldName()}
        <span className="text-graphql-otel-green ml-2">{processedType}</span>
      </div>

      {["query", "mutation"].includes(parentName) && (
        <div className="py-2">
          <Stats aggregate={aggregate} />
        </div>
      )}
    </li>
  );
}
