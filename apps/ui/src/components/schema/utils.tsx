import { type TypeNode } from "graphql";

export const kindKeywordMapper: Record<string, string> = {
  ObjectTypeDefinition: "type",
  InputObjectTypeDefinition: "input",
};

export const extractTypeName = (typeNode: TypeNode): string => {
  if (typeNode.kind === "NamedType") {
    return typeNode.name.value;
  }
  if (typeNode.kind === "ListType") {
    return `[${extractTypeName(typeNode.type)}]`;
  }
  if (typeNode.kind === "NonNullType") {
    return `${extractTypeName(typeNode.type)}!`;
  }

  return "";
};

export const processedType = (type: string) => {
  return Array.from(type).map((char, index) => {
    if (["!", "[", "]"].includes(char)) {
      return (
        <span key={index} className="text-neutral-100">
          {char}
        </span>
      );
    }
    return char;
  });
};
