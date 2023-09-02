import { graphql } from '@graphql-debugger/utils';

interface QueryViewerProps {
  doc: string;
}

interface RenderFieldProps {
  field: graphql.FieldNode;
  renderSelection: (selection: graphql.SelectionNode, index: number) => JSX.Element | null;
}

function renderType(type: graphql.TypeNode): JSX.Element {
  if (type.kind === graphql.Kind.NAMED_TYPE) {
    return <span>{type.name.value}</span>;
  } else if (type.kind === graphql.Kind.LIST_TYPE) {
    return <span>[{renderType(type.type)}]</span>;
  } else if (type.kind === graphql.Kind.NON_NULL_TYPE) {
    return <span>{renderType(type.type)}!</span>;
  }

  return <span className="text-graphql-otel-gray">[Unsupported Type]</span>;
}

export function RenderField({ field, renderSelection }: RenderFieldProps) {
  const name = field.name.value;

  const args = field.arguments
    ? field.arguments.map((arg, argIndex) => (
        <div key={argIndex}>
          <span className="text-graphql-otel-green">{arg.name.value}</span>:{' '}
          <span>{renderArgumentValue(arg.value)}</span>
        </div>
      ))
    : null;

  const selections = field.selectionSet?.selections.map((selection, index) =>
    renderSelection(selection, index)
  );

  return (
    <div className="text-graphiql-light pl-2">
      <span>{name}</span>
      {args && args.length > 0 && <span className="ml-1">{'('}</span>}
      {args && args.length > 0 && <div className="ml-3">{args}</div>}
      {args && args.length > 0 && <span className="ml-1">{')'}</span>}
      {selections && selections.length > 0 && <span className="ml-1">{'{'}</span>}

      {selections && selections.length > 0 && (
        <div>
          {selections}
          <span>{'}'}</span>
        </div>
      )}
    </div>
  );
}

function renderArgumentValue(value: graphql.ArgumentNode['value'], indentLevel: number = 0) {
  const indent = ' '.repeat(indentLevel * 2);

  if (value.kind === graphql.Kind.INT || value.kind === graphql.Kind.FLOAT) {
    return <span>{value.value}</span>;
  } else if (value.kind === graphql.Kind.STRING) {
    return <span>"{value.value}"</span>;
  } else if (value.kind === graphql.Kind.BOOLEAN) {
    return <span>{value.value ? 'true' : 'false'}</span>;
  } else if (value.kind === graphql.Kind.ENUM) {
    return <span>{value.value}</span>;
  } else if (value.kind === graphql.Kind.LIST) {
    const items = value.values.map((item, index) => (
      <div key={index}>
        {indent}
        {renderArgumentValue(item, indentLevel + 1)}
        {index !== value.values.length - 1 && ', '}
      </div>
    ));
    return (
      <span className="text-graphql-otel-green">
        [<div className="ml-2">{items}</div>
        {indent}]
      </span>
    );
  } else if (value.kind === graphql.Kind.OBJECT) {
    const properties = value.fields.map((field, i) => (
      <div key={field.name.value}>
        <span className="text-graphiql-light">
          {indent}
          {field.name.value}:{' '}
        </span>
        {renderArgumentValue(field.value, indentLevel + 1)}
        {i !== value.fields.length - 1 && ', '}
      </div>
    ));

    return (
      <span className="text-graphiql-highlight">
        {'{'}
        <div className="ml-2">{properties}</div>
        {indent}
        {'}'}
      </span>
    );
  } else if (value.kind === graphql.Kind.VARIABLE) {
    return <span className="text-graphql-otel-green">${value.name.value}</span>;
  } else {
    return <span className="text-graphql-otel-gray">[Unsupported Value]</span>;
  }
}

export function QueryViewer({ doc }: QueryViewerProps) {
  const ast: graphql.DocumentNode = graphql.parse(doc);

  const renderSelection = (selection: graphql.SelectionNode, index: number) => {
    if (selection.kind === graphql.Kind.FIELD) {
      return (
        <RenderField
          key={index}
          field={selection as graphql.FieldNode}
          renderSelection={renderSelection}
        />
      );
    } else if (selection.kind === graphql.Kind.FRAGMENT_SPREAD) {
      const fragmentSpread = selection as graphql.FragmentSpreadNode;

      return (
        <div key={index} className="ml-1 p-1 text-graphiql-light">
          ...<span className="text-graphql-otel-green">{fragmentSpread.name.value}</span>
        </div>
      );
    } else if (selection.kind === graphql.Kind.INLINE_FRAGMENT) {
      const inlineFragment = selection as graphql.InlineFragmentNode;

      return (
        <div key={index} className="ml-1 p-1 text-graphiql-light">
          {'... on '}
          {inlineFragment.typeCondition?.name.value}
          <ul className="flex flex-col gap-1">
            {inlineFragment.selectionSet.selections.map((selection, selectionIndex) =>
              renderSelection(selection, selectionIndex)
            )}
          </ul>
        </div>
      );
    }
    return null;
  };

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
                    {renderType(varDef.type)}
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
                    {def.selectionSet.selections.map((selection, selectionIndex) =>
                      renderSelection(selection, selectionIndex)
                    )}
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
