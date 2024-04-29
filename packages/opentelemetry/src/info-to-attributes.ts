import { AttributeNames } from "@graphql-debugger/types";
import { isGraphQLInfoRoot } from "@graphql-debugger/utils";

import { GraphQLResolveInfo } from "graphql";

export function infoToAttributes({
  info,
  schemaHash,
}: {
  info: GraphQLResolveInfo;
  schemaHash?: string;
  args?: any;
  context?: any;
}): Record<string, any> {
  const isRoot = isGraphQLInfoRoot({ info });

  const attributes = {
    [AttributeNames.OPERATION_NAME]: info.fieldName,
    [AttributeNames.OPERATION_RETURN_TYPE]: info.returnType.toString(),
    [AttributeNames.SCHEMA_HASH]: schemaHash,
    ...(isRoot
      ? {
          [AttributeNames.OPERATION_ROOT]: true,
          [AttributeNames.DOCUMENT]: JSON.stringify(info.operation),
          [AttributeNames.OPERATION_TYPE]:
            info.operation.operation.toLowerCase(),
          ...(info.operation.name?.value
            ? {
                [AttributeNames.OPERATION_ROOT_NAME]:
                  info.operation.name?.value,
              }
            : {}),
        }
      : {}),
  };

  return attributes;
}
