import {
  FieldNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  Kind,
  SelectionNode,
} from "graphql";

import { QueryField } from "./field";

export function Selection({
  selection,
  index,
}: {
  selection: SelectionNode;
  index: number;
}) {
  if (selection.kind === Kind.FIELD) {
    return (
      <QueryField
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
      <div key={index} className="ml-1 p-1 text-neutral">
        ...
        <span className="text-dark-green">{fragmentSpread.name.value}</span>
      </div>
    );
  }

  if (selection.kind === Kind.INLINE_FRAGMENT) {
    const inlineFragment = selection as InlineFragmentNode;

    return (
      <div key={index} className="ml-1 p-1 text-neutral">
        {"... on "}
        {inlineFragment.typeCondition?.name.value}
        <ul className="flex flex-col gap-1">
          {inlineFragment.selectionSet.selections.map((s, i) => (
            <Selection key={`${s}${i}`} selection={s} index={i} />
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
