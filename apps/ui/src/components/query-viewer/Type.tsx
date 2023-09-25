import { Kind, TypeNode } from "graphql";

export function Type({ type }: { type: TypeNode }) {
  if (type.kind === Kind.NAMED_TYPE) {
    return <span>{type.name.value}</span>;
  }

  if (type.kind === Kind.LIST_TYPE) {
    return (
      <span>
        [<Type type={type.type} />]
      </span>
    );
  }

  if (type.kind === Kind.NON_NULL_TYPE) {
    return (
      <span>
        <Type type={type.type} />!
      </span>
    );
  }

  return <span className="text-graphql-otel-gray">[Unsupported Type]</span>;
}
