import { Field } from "./Field";
import type { TypeProps } from "./types";
import { kindKeywordMapper } from "./utils";

export const Type = ({ schemaId, type }: TypeProps) => {
  let parentName = type.name;
  if (["Query", "Mutation"].includes(type.name)) {
    parentName = type.name.toLocaleLowerCase();
  }

  return (
    <div className="flex flex-col">
      <p className="flex gap-1">
        <span className="text-primary">{kindKeywordMapper[type.kind]}</span>
        <span className="text-secondary-purple">{type.name}</span>
        <span className="text-neutral-100/70">{`{`}</span>
      </p>
      <div>
        <ul className="flex flex-col">
          {type.fields.map((field, index) => (
            <Field
              schemaId={schemaId}
              parentName={parentName}
              key={index}
              field={field}
            />
          ))}
        </ul>
      </div>
      <span className="text-neutral-100/70">{`}`}</span>
    </div>
  );
};
