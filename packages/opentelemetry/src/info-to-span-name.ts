import { GraphQLResolveInfo } from "graphql";

export function infoToSpanName({
  info,
  isRoot,
}: {
  info: GraphQLResolveInfo;
  isRoot?: boolean;
}): {
  spanName: string;
  operationName?: string;
} {
  let spanName = "";
  let operationName;
  if (isRoot) {
    spanName = `${info.parentType.name.toLowerCase()} ${info.fieldName}`;
    if (info.operation.name) {
      operationName = info.operation.name.value;
    }
  } else {
    spanName = `${info.parentType.name} ${info.fieldName}`;
  }

  return { spanName, operationName };
}
