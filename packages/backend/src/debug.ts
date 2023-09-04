import { Debug, type Debugger } from "@graphql-debugger/utils";

const debugNamespace = "backend";

export const debug: Debugger = Debug(debugNamespace);
