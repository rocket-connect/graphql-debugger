import { GraphQLResolveInfo } from "graphql";

export function isGraphQLInfoRoot({ info }: { info: GraphQLResolveInfo }) {
  const isRoot = ["Query", "Mutation", "Subscription"].includes(
    info.parentType.name,
  );

  return isRoot;
}
