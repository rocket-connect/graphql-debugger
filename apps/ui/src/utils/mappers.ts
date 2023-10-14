export const metaMapper: Record<string, string> = {
  variables: "JSON variables attached to the Query.",
  result: "The result of the Query.",
  context: "Safe JSON of the GraphQL context obj.",
  errors: "Errors of each resolver",
};

export const jsonMapper: Record<string, string> = {
  variables: "graphqlVariables",
  result: "graphqlResult",
  context: "graphqlContext",
};

export const variablesHeader = ["Variables", "Result", "Context", "Errors"];

export const kindKeywordMapper: Record<string, string> = {
  ObjectTypeDefinition: "type",
  InputObjectTypeDefinition: "input",
};
