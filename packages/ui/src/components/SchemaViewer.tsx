import { parse, FieldDefinitionNode } from 'graphql';

function extractTypeName(typeNode): string {
  if (typeNode.kind === 'NamedType') {
    return typeNode.name.value;
  }
  if (typeNode.kind === 'ListType') {
    return `[${extractTypeName(typeNode.type)}]`;
  }
  if (typeNode.kind === 'NonNullType') {
    return `${extractTypeName(typeNode.type)}!`;
  }

  return '';
}

function RenderField({ field }: { field: FieldDefinitionNode }) {
  const name = field.name.value;
  const type = extractTypeName(field.type);

  const processedType = Array.from(type).map((char, index) => {
    if (['!', '[', ']'].includes(char)) {
      return (
        <span key={index} className="text-white">
          {char}
        </span>
      );
    }
    return char;
  });

  return (
    <li className="my-2 ml-2 p-2">
      <div className="flex items-center">
        <span>{name}:</span>
        <span className="text-graphql-otel-green ml-2">{processedType}</span>
      </div>
      <div className="pl-2 text-xs font-light">
        <ul className="list-disc list-inside marker:text-graphql-otel-green">
          <li>
            Resolve Count: <span className="font-bold">45</span>
          </li>
          <li>
            Error Count: <span className="font-bold text-red-500">3</span>
          </li>
          <li>
            Average Duration: <span className="font-bold">100ms</span>
          </li>
          <li>
            Last Resolved: <span className="font-bold">a few seconds ago</span>
          </li>
        </ul>
      </div>
    </li>
  );
}
function RenderType({
  type,
}: {
  type: { name: string; kind: string; fields: readonly FieldDefinitionNode[] };
}) {
  let kindKeyword = '';
  if (type.kind === 'ObjectTypeDefinition') {
    kindKeyword = 'type';
  } else if (type.kind === 'InputObjectTypeDefinition') {
    return null;
  }

  return (
    <div className="flex flex-col py-5 font-bold">
      <p>
        <span>{kindKeyword}</span> <span className="text-graphql-otel-green">{type.name}</span>{' '}
        {`{`}
      </p>
      <ul className="flex flex-col gap-2 border-l border-graphql-otel-green my-2 ml-2">
        {type.fields.map((field, index) => (
          <RenderField key={index} field={field} />
        ))}
      </ul>
      <p>{`}`}</p>
    </div>
  );
}
export function SchemaViewer({ typeDefs }: { typeDefs: string }) {
  const parsed = parse(typeDefs);

  return (
    <div>
      <pre className="text-sm">
        {parsed.definitions.map((def, index) => {
          if (def.kind === 'ObjectTypeDefinition' || def.kind === 'InputObjectTypeDefinition') {
            const name = def.name.value;
            const kind = def.kind;

            return (
              <div className="flex flex-col" key={def.name.value}>
                <RenderType
                  key={index}
                  type={{ name, kind, fields: def.fields as FieldDefinitionNode[] }}
                />
              </div>
            );
          }

          return null;
        })}
      </pre>
    </div>
  );
}
