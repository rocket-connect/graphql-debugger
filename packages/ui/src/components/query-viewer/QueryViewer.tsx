import { graphql } from '@graphql-debugger/utils';
import { Type } from './Type';
import { Selection } from './Selection';

export function QueryViewer({ doc }: { doc: string }) {
  const ast: graphql.DocumentNode = graphql.parse(doc);

  return (
    <div className="flex-1 overflow-y-auto">
      <pre className="text-xs flex flex-col gap-5">
        {ast?.definitions.map((def, index) => {
          if (def.kind === graphql.Kind.OPERATION_DEFINITION) {
            let kind = def.operation;
            const variableDefinitions = def.variableDefinitions
              ? def.variableDefinitions.map((varDef) => (
                  <div key={varDef.variable.name.value}>
                    <span className="text-graphql-otel-green"> ${varDef.variable.name.value}</span>:{' '}
                    <Type type={varDef.type} />
                  </div>
                ))
              : null;

            return (
              <div key={index} className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-graphiql-light">
                    <span className="text-graphiql-pink">{kind}</span>
                    {variableDefinitions?.length ? (
                      <span>
                        {' '}
                        {'('}
                        <div className="flex flex-col ml-3">{variableDefinitions}</div>
                        {')'}
                      </span>
                    ) : (
                      <></>
                    )}
                    <span>{' {'}</span>
                  </span>
                </div>
                <div className="py-1 pl-2">
                  <ul className="flex flex-col gap-1">
                    {def.selectionSet.selections.map((selection, selectionIndex) => (
                      <Selection selection={selection} index={selectionIndex} />
                    ))}
                  </ul>
                </div>

                <span className="text-graphiql-light">{' }'}</span>
              </div>
            );
          }

          return null;
        })}
      </pre>
    </div>
  );
}
