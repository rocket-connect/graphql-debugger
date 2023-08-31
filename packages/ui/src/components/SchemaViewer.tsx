import { parse, FieldDefinitionNode } from 'graphql';
import { useEffect, useState } from 'react';
import { aggregateSpans } from '../api/aggregate-spans';
import { AggregateSpansResponse } from '../graphql-types';
import moment from 'moment';

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

function RenderStats({ aggregate }: { aggregate: AggregateSpansResponse | null }) {
  const lastResolveMilis = BigInt(aggregate?.lastResolved || 0) / BigInt(1000000);
  const lastResolved = new Date(Number(lastResolveMilis));

  return (
    <div className="pl-2 text-xs font-light text-graphiql-light">
      <ul className="list-disc list-inside marker:text-graphql-otel-green flex flex-col gap-2">
        <li>
          Resolve Count: <span className="font-bold">{aggregate?.resolveCount}</span>
        </li>
        <li>
          Error Count: <span className="font-bold text-red-500">{aggregate?.errorCount}</span>
        </li>
        <li>
          Average Duration:{' '}
          <span className="font-bold">
            {Number(BigInt(aggregate?.averageDuration || 0) / BigInt(1000000))} ms
          </span>
        </li>
        <li>
          Last Resolved: <span className="font-bold">{moment(lastResolved).fromNow()}</span>
        </li>
      </ul>
    </div>
  );
}

function RenderField({
  field,
  parentName,
  schemaId,
}: {
  field: FieldDefinitionNode;
  parentName: string;
  schemaId: string;
}) {
  const name = field.name.value;
  const type = extractTypeName(field.type);
  const [aggregate, setAggregate] = useState<AggregateSpansResponse | null>(null);

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
  }, [name, schemaId]);

  return (
    <li className="ml-2 p-2">
      <div className="flex items-center">
        <span className="text-graphiql-light">{name}:</span>
        <span className="text-graphql-otel-green ml-2">{processedType}</span>
      </div>
      <div className="py-2">
        <RenderStats aggregate={aggregate} />
      </div>
    </li>
  );
}

function RenderType({
  schemaId,
  type,
}: {
  schemaId: string;
  type: { name: string; kind: string; fields: readonly FieldDefinitionNode[] };
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
    <div className="flex flex-col tracking-widest spacing-widest">
      <p>
        <span className="text-graphiql-pink">{kindKeyword}</span>{' '}
        <span className="text-graphql-otel-green">{type.name}</span>{' '}
        <span className="text-graphiql-light">{`{`}</span>
      </p>
      <div className="border-l border-graphiql-border ml-2 pl-2 my-2">
        <ul className="flex flex-col gap-2">
          {type.fields.map((field, index) => (
            <RenderField schemaId={schemaId} parentName={parentName} key={index} field={field} />
          ))}
        </ul>
      </div>
      <span className="text-graphiql-light">{`}`}</span>
    </div>
  );
}

export function SchemaViewer({ schemaId, typeDefs }: { schemaId: string; typeDefs: string }) {
  const parsed = parse(typeDefs);

  return (
    <div className="flex-1 overflow-y-auto">
      <pre className="text-xs flex flex-col gap-5">
        {parsed.definitions.map((def, index) => {
          if (def.kind === 'ObjectTypeDefinition' || def.kind === 'InputObjectTypeDefinition') {
            const name = def.name.value;
            const kind = def.kind;

            return (
              <div className="flex flex-col" key={def.name.value}>
                <RenderType
                  schemaId={schemaId}
                  key={index}
                  type={{
                    name,
                    kind,
                    fields: def.fields as FieldDefinitionNode[],
                  }}
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
