import debug, { Debugger } from "debug";

export const debugRootNamespace = "@graphql-debugger";

export const Debug = (name: string): Debugger =>
  debug(`${debugRootNamespace}:${name}`);

export { Debugger };
