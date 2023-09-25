import { GraphQLResolveInfo } from "graphql";

export function infoToSpanName({ info }: { info: GraphQLResolveInfo }): string {
  const isRoot = ["Query", "Mutation", "Subscription"].includes(
    info.parentType.name,
  );

  let name = "";
  if (isRoot) {
    name = `${info.parentType.name.toLowerCase()} ${
      info.operation.name?.value || info.fieldName
    }`;
  } else {
    name = `${info.parentType.name} ${info.fieldName}`;
  }

  return name;
}
