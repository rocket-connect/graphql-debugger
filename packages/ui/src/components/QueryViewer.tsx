import {
  parse,
  Kind,
  DocumentNode,
  FieldNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  SelectionNode,
  TypeNode,
  ArgumentNode,
} from 'graphql';

interface QueryViewerProps {
  doc: string;
}

interface RenderFieldProps {
  field: FieldNode;
  renderSelection: (selection: SelectionNode, index: number) => JSX.Element | null;
}

function renderType(type: TypeNode): JSX.Element {
  if (type.kind === Kind.NAMED_TYPE) {
    return <span>{type.name.value}</span>;
  } else if (type.kind === Kind.LIST_TYPE) {
    return <span>[{renderType(type.type)}]</span>;
  } else if (type.kind === Kind.NON_NULL_TYPE) {
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

function renderArgumentValue(value: ArgumentNode['value'], indentLevel: number = 0) {
  const indent = ' '.repeat(indentLevel * 2);

  if (value.kind === Kind.INT || value.kind === Kind.FLOAT) {
    return <span>{value.value}</span>;
  } else if (value.kind === Kind.STRING) {
    return <span>"{value.value}"</span>;
  } else if (value.kind === Kind.BOOLEAN) {
    return <span>{value.value ? 'true' : 'false'}</span>;
  } else if (value.kind === Kind.ENUM) {
    return <span>{value.value}</span>;
  } else if (value.kind === Kind.LIST) {
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
  } else if (value.kind === Kind.OBJECT) {
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
  } else if (value.kind === Kind.VARIABLE) {
    return <span className="text-graphql-otel-green">${value.name.value}</span>;
  } else {
    return <span className="text-graphql-otel-gray">[Unsupported Value]</span>;
  }
}

export function QueryViewer({ doc }: QueryViewerProps) {
  const ast: DocumentNode = parse(doc);

  const renderSelection = (selection: SelectionNode, index: number) => {
    if (selection.kind === Kind.FIELD) {
      return (
        <RenderField key={index} field={selection as FieldNode} renderSelection={renderSelection} />
      );
    } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
      const fragmentSpread = selection as FragmentSpreadNode;

      return (
        <div key={index} className="ml-1 p-1 text-graphiql-light">
          ...<span className="text-graphql-otel-green">{fragmentSpread.name.value}</span>
        </div>
      );
    } else if (selection.kind === Kind.INLINE_FRAGMENT) {
      const inlineFragment = selection as InlineFragmentNode;

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
          if (def.kind === Kind.OPERATION_DEFINITION) {
            let kind = def.operation;
            const variableDefinitions = def.variableDefinitions
              ? def.variableDefinitions.map((varDef, varIndex) => (
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
                    <span className="text-graphiql-pink">{kind}</span>{' '}
                    {variableDefinitions && (
                      <span>
                        {'('}
                        <div className="flex flex-col ml-3">{variableDefinitions}</div>
                        {')'}
                      </span>
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
