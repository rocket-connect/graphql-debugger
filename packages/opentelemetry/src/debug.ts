import {
  Debug,
  type Debugger,
  debugRootNamespace,
} from "@graphql-debugger/utils";

const debugNamespace = "opentelemetry";

export const debug: Debugger = Debug(debugNamespace);

export { debugRootNamespace };
