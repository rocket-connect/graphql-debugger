import { graphql } from "@graphql-debugger/utils";

export function Type({ type }: { type: graphql.TypeNode }) {
  if (type.kind === graphql.Kind.NAMED_TYPE) {
    return <span>{type.name.value}</span>;
  }

  if (type.kind === graphql.Kind.LIST_TYPE) {
    return (
      <span>
        [<Type type={type.type} />]
      </span>
    );
  }

  if (type.kind === graphql.Kind.NON_NULL_TYPE) {
    return (
      <span>
        <Type type={type.type} />!
      </span>
    );
  }

  return <span className="text-graphql-otel-gray">[Unsupported Type]</span>;
}
