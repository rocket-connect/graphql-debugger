import { Kind, TypeNode } from "graphql";

export function QueryType({ type }: { type: TypeNode }) {
  if (type.kind === Kind.NAMED_TYPE) {
    return <span>{type.name.value}</span>;
  }

  if (type.kind === Kind.LIST_TYPE) {
    return (
      <span>
        [<QueryType type={type.type} />]
      </span>
    );
  }

  if (type.kind === Kind.NON_NULL_TYPE) {
    return (
      <span>
        <QueryType type={type.type} />!
      </span>
    );
  }

  return <span className="text-gray-500">[Unsupported Type]</span>;
}
