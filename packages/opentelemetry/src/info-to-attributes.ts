import { AttributeNames } from "@graphql-debugger/types";
import { safeJson } from "@graphql-debugger/utils";

import { GraphQLResolveInfo, print } from "graphql";

export function infoToAttributes({
  info,
  schemaHash,
  args,
  context,
  isRoot,
  operationName,
}: {
  info: GraphQLResolveInfo;
  schemaHash?: string;
  args?: any;
  context?: any;
  isRoot?: boolean;
  operationName?: string;
}): Record<string, any> {
  const _args = args || info.variableValues;

  const attributes = {
    [AttributeNames.OPERATION_NAME]: info.fieldName,
    [AttributeNames.OPERATION_TYPE]: info.operation.operation.toLowerCase(),
    [AttributeNames.OPERATION_RETURN_TYPE]: info.returnType.toString(),
    [AttributeNames.SCHEMA_HASH]: schemaHash,
    ...(isRoot
      ? {
          [AttributeNames.OPERATION_ROOT]: true,

          ...(operationName
            ? {
                [AttributeNames.OPERATION_ROOT_NAME]: operationName,
              }
            : {}),

          [AttributeNames.DOCUMENT]: print(info.operation),
          ...(_args
            ? {
                [AttributeNames.OPERATION_ARGS]: safeJson({
                  args: _args,
                }),
              }
            : {}),

          ...(context
            ? {
                [AttributeNames.OPERATION_CONTEXT]: safeJson({ context }),
              }
            : {}),
        }
      : {}),
  };

  return attributes;
}
