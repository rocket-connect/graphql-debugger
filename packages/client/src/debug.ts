import { Debug, type Debugger } from "@graphql-debugger/utils";

const debugNamespace = "client";

export const debug: Debugger = Debug(debugNamespace);
