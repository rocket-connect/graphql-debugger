import { graphql } from '@graphql-debugger/utils';
import { Field } from './Field';

export function Selection({
  selection,
  index,
}: {
  selection: graphql.SelectionNode;
  index: number;
}) {
  if (selection.kind === graphql.Kind.FIELD) {
    return (
      <Field
        key={index}
        field={selection as graphql.FieldNode}
        renderSelection={(selection, index) => <Selection selection={selection} index={index} />}
      />
    );
  }

  if (selection.kind === graphql.Kind.FRAGMENT_SPREAD) {
    const fragmentSpread = selection as graphql.FragmentSpreadNode;

    return (
      <div key={index} className="ml-1 p-1 text-graphiql-light">
        ...<span className="text-graphql-otel-green">{fragmentSpread.name.value}</span>
      </div>
    );
  }

  if (selection.kind === graphql.Kind.INLINE_FRAGMENT) {
    const inlineFragment = selection as graphql.InlineFragmentNode;

    return (
      <div key={index} className="ml-1 p-1 text-graphiql-light">
        {'... on '}
        {inlineFragment.typeCondition?.name.value}
        <ul className="flex flex-col gap-1">
          {inlineFragment.selectionSet.selections.map((selection, selectionIndex) => (
            <Selection selection={selection} index={selectionIndex} />
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
