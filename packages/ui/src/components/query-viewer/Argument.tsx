import { ArgumentNode, Kind } from "graphql";

export function Argument({
  value,
  indentLevel = 0,
}: {
  value: ArgumentNode["value"];
  indentLevel?: number;
}) {
  const indent = " ".repeat(indentLevel * 2);

  if (value.kind === Kind.INT || value.kind === Kind.FLOAT) {
    return <span>{value.value}</span>;
  }

  if (value.kind === Kind.STRING) {
    return <span>"{value.value}"</span>;
  }

  if (value.kind === Kind.BOOLEAN) {
    return <span>{value.value ? "true" : "false"}</span>;
  }

  if (value.kind === Kind.ENUM) {
    return <span>{value.value}</span>;
  }

  if (value.kind === Kind.LIST) {
    const items = value.values.map((item, index) => (
      <div key={index}>
        {indent}
        <Argument value={item} indentLevel={indentLevel + 1} />
        {index !== value.values.length - 1 && ", "}
      </div>
    ));

    return (
      <span className="text-graphql-otel-green">
        [<div className="ml-2">{items}</div>
        {indent}]
      </span>
    );
  }

  if (value.kind === Kind.OBJECT) {
    const properties = value.fields.map((field, i) => (
      <div key={field.name.value}>
        <span className="text-graphiql-light">
          {indent}
          {field.name.value}:{" "}
        </span>
        <Argument value={field.value} indentLevel={indentLevel + 1} />
        {i !== value.fields.length - 1 && ", "}
      </div>
    ));

    return (
      <span className="text-graphiql-highlight">
        {"{"}
        <div className="ml-2">{properties}</div>
        {indent}
        {"}"}
      </span>
    );
  }

  if (value.kind === Kind.VARIABLE) {
    return <span className="text-graphql-otel-green">${value.name.value}</span>;
  }

  return <span className="text-graphql-otel-gray">[Unsupported Value]</span>;
}
