import { isGraphQLInfoRoot } from "@graphql-debugger/utils";

import { GraphQLResolveInfo } from "graphql";

export function infoToSpanName({ info }: { info: GraphQLResolveInfo }): {
  spanName: string;
} {
  let spanName = "";
  if (isGraphQLInfoRoot({ info })) {
    spanName = `${info.parentType.name.toLowerCase()} ${info.fieldName}`;
  } else {
    spanName = `${info.parentType.name} ${info.fieldName}`;
  }

  return { spanName };
}
