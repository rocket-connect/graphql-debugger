import { AttributeNames } from "@graphql-debugger/types";
import { safeJson } from "@graphql-debugger/utils";

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
  const isRoot = ["Query", "Mutation", "Subscription"].includes(
    info.parentType.name,
  );

  const operationArgs = safeJson(info.variableValues || {});

  const attributes = {
    [AttributeNames.OPERATION_NAME]: info.fieldName,
    [AttributeNames.OPERATION_TYPE]: info.operation.operation.toLowerCase(),
    [AttributeNames.OPERATION_RETURN_TYPE]: info.returnType.toString(),
    [AttributeNames.SCHEMA_HASH]: schemaHash,
    ...(isRoot
      ? {
          [AttributeNames.DOCUMENT]: print(info.operation),
          ...(args ? { [AttributeNames.OPERATION_ARGS]: operationArgs } : {}),
          ...(context
            ? {
                [AttributeNames.OPERATION_CONTEXT]: safeJson(context),
              }
            : {}),
        }
      : {}),
  };

  return attributes;
}
