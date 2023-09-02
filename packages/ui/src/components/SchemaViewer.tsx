import { graphql } from '@graphql-debugger/utils';
import { useEffect, useState } from 'react';
import { aggregateSpans } from '../api/aggregate-spans';
import { AggregateSpansResponse } from '../graphql-types';
import moment from 'moment';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
      <ul className="list-disc list-inside marker:text-graphql-otel-green flex flex-col gap-2 ">
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
  field: graphql.FieldDefinitionNode;
  parentName: string;
  schemaId: string;
}) {
  const [searchParams] = useSearchParams();
  const rootSpanName = searchParams.get('rootSpanName');
  const navigate = useNavigate();
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

  const renderFieldName = () => {
    if (['query', 'mutation'].includes(parentName)) {
      const _rootSpanName = `${parentName} ${name}`;
      return (
        <span
          className={`text-graphiql-light underline hover:cursor-pointer ${
            rootSpanName === _rootSpanName ? 'font-bold decoration-graphiql-pink' : ''
          }`}
          onClick={() => {
            navigate(`?${new URLSearchParams({ rootSpanName: _rootSpanName }).toString()}`);
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

      {['query', 'mutation'].includes(parentName) && (
        <div className="py-2">
          <RenderStats aggregate={aggregate} />
        </div>
      )}
    </li>
  );
}

function RenderType({
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
            <RenderField schemaId={schemaId} parentName={parentName} key={index} field={field} />
          ))}
        </ul>
      </div>
      <span className="text-graphiql-light">{`}`}</span>
    </div>
  );
}

export function SchemaViewer({ schemaId, typeDefs }: { schemaId: string; typeDefs: string }) {
  const parsed = graphql.parse(typeDefs);

  const queryDefs: graphql.ObjectTypeDefinitionNode[] = [];
  const mutationDefs: graphql.ObjectTypeDefinitionNode[] = [];
  const otherDefs: graphql.ObjectTypeDefinitionNode[] = [];

  parsed.definitions.forEach((def) => {
    if (def.kind === 'ObjectTypeDefinition') {
      if (def.name.value === 'Query') {
        queryDefs.push(def);
      } else if (def.name.value === 'Mutation') {
        mutationDefs.push(def);
      } else {
        otherDefs.push(def);
      }
    }
  });

  const sortedDefs = [...queryDefs, ...mutationDefs, ...otherDefs];

  return (
    <div className="flex-1 overflow-y-auto">
      <pre className="text-xs flex flex-col gap-5">
        {sortedDefs.map((def, index) => {
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
                    fields: def.fields as graphql.FieldDefinitionNode[],
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
