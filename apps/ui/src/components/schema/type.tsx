import { FieldDefinitionNode } from "graphql";

import { kindKeywordMapper } from "../../utils/mappers";
import { Field } from "./field";

export interface TypeProps {
  schemaId: string;
  type: {
    name: string;
    kind: string;
    fields: readonly FieldDefinitionNode[];
  };
}

export function Type({ schemaId, type }: TypeProps) {
  let parentName = type.name;
  if (["Query", "Mutation"].includes(type.name)) {
    parentName = type.name.toLocaleLowerCase();
  }

  return (
    <div className="flex flex-col text-sm">
      <p className="flex gap-1">
        <span className="text-pink">{kindKeywordMapper[type.kind]}</span>
        <span className="text-purple">{type.name}</span>
        <span className="text-neutral/70">{`{`}</span>
      </p>
      <div>
        <ul className="flex flex-col">
          {type.fields.map((field, index) => (
            <Field
              schemaId={schemaId}
              parentName={parentName}
              key={index}
              field={field}
              isLastField={index === type.fields.length - 1}
            />
          ))}
        </ul>
      </div>
      <span className="text-neutral/70">{`}`}</span>
    </div>
  );
}
