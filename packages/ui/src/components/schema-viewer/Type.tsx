import { graphql } from '@graphql-debugger/utils';
import { Field } from './Field';

export function Type({
  schemaId,
  type,
}: {
  schemaId: string;
  type: { name: string; kind: string; fields: readonly graphql.FieldDefinitionNode[] };
}) {
  let kindKeyword = '';
  if (type.kind === 'ObjectTypeDefinition') {
    kindKeyword = 'type';
  } else if (type.kind === 'InputObjectTypeDefinition') {
    return null;
  }

  let parentName = type.name;
  if (['Query', 'Mutation'].includes(type.name)) {
    parentName = type.name.toLocaleLowerCase();
  }

  return (
    <div className="flex flex-col">
      <p>
        <span className="text-graphiql-pink">{kindKeyword}</span>{' '}
        <span className="text-graphql-otel-green">{type.name}</span>{' '}
        <span className="text-graphiql-light">{`{`}</span>
      </p>
      <div className="border-l border-graphiql-border ml-2 pl-2 my-2">
        <ul className="flex flex-col gap-2">
          {type.fields.map((field, index) => (
            <Field schemaId={schemaId} parentName={parentName} key={index} field={field} />
          ))}
        </ul>
      </div>
      <span className="text-graphiql-light">{`}`}</span>
    </div>
  );
}
