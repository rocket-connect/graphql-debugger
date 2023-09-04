import { Debug, type Debugger } from "@graphql-debugger/utils";

const debugNamespace = "e2e";

export const debug: Debugger = Debug(debugNamespace);
