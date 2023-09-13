import { FieldNode, SelectionNode } from "graphql";
import { Argument } from "./Argument";

export function Field({
  field,
  renderSelection,
}: {
  field: FieldNode;
  renderSelection: (
    selection: SelectionNode,
    index: number,
  ) => JSX.Element | null;
}) {
  const name = field.name.value;

  const args = field.arguments
    ? field.arguments.map((arg, argIndex) => (
        <div key={argIndex}>
          <span className="text-graphql-otel-green">{arg.name.value}</span>:{" "}
          <span>
            <Argument value={arg.value} />
          </span>
        </div>
      ))
    : null;

  const selections = field.selectionSet?.selections.map((selection, index) =>
    renderSelection(selection, index),
  );

  return (
    <div className="text-graphiql-light pl-2">
      <span>{name}</span>
      {args && args.length > 0 && <span className="ml-1">{"("}</span>}
      {args && args.length > 0 && <div className="ml-3">{args}</div>}
      {args && args.length > 0 && <span className="ml-1">{")"}</span>}
      {selections && selections.length > 0 && (
        <span className="ml-1">{"{"}</span>
      )}

      {selections && selections.length > 0 && (
        <div>
          {selections}
          <span>{"}"}</span>
        </div>
      )}
    </div>
  );
}
