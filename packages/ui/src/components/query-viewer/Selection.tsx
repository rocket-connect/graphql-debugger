import {
  SelectionNode,
  Kind,
  FieldNode,
  FragmentSpreadNode,
  InlineFragmentNode,
} from "graphql";
import { Field } from "./Field";

export function Selection({
  selection,
  index,
}: {
  selection: SelectionNode;
  index: number;
}) {
  if (selection.kind === Kind.FIELD) {
    return (
      <Field
        key={index}
        field={selection as FieldNode}
        renderSelection={(selection, index) => (
          <Selection selection={selection} index={index} />
        )}
      />
    );
  }

  if (selection.kind === Kind.FRAGMENT_SPREAD) {
    const fragmentSpread = selection as FragmentSpreadNode;

    return (
      <div key={index} className="ml-1 p-1 text-graphiql-light">
        ...
        <span className="text-graphql-otel-green">
          {fragmentSpread.name.value}
        </span>
      </div>
    );
  }

  if (selection.kind === Kind.INLINE_FRAGMENT) {
    const inlineFragment = selection as InlineFragmentNode;

    return (
      <div key={index} className="ml-1 p-1 text-graphiql-light">
        {"... on "}
        {inlineFragment.typeCondition?.name.value}
        <ul className="flex flex-col gap-1">
          {inlineFragment.selectionSet.selections.map(
            (selection, selectionIndex) => (
              <Selection selection={selection} index={selectionIndex} />
            ),
          )}
        </ul>
      </div>
    );
  }

  return null;
}
