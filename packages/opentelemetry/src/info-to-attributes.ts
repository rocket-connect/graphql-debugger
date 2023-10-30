import { AttributeNames } from "@graphql-debugger/types";
import { isGraphQLInfoRoot, safeJson } from "@graphql-debugger/utils";

import { GraphQLResolveInfo, print } from "graphql";

export function infoToAttributes({
  info,
  schemaHash,
  args,
  context,
}: {
  info: GraphQLResolveInfo;
  schemaHash?: string;
  args?: any;
  context?: any;
}): Record<string, any> {
  const _args = args || info.variableValues;
  const isRoot = isGraphQLInfoRoot({ info });

  const attributes = {
    [AttributeNames.OPERATION_NAME]: info.fieldName,
    [AttributeNames.OPERATION_RETURN_TYPE]: info.returnType.toString(),
    [AttributeNames.SCHEMA_HASH]: schemaHash,
    ...(isRoot
      ? {
          [AttributeNames.OPERATION_ROOT]: true,
          [AttributeNames.DOCUMENT]: print(info.operation),
          [AttributeNames.OPERATION_TYPE]:
            info.operation.operation.toLowerCase(),

          ...(info.operation.name?.value
            ? {
                [AttributeNames.OPERATION_ROOT_NAME]:
                  info.operation.name?.value,
              }
            : {}),

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
