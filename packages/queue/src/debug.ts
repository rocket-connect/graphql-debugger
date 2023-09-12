import { Debug, type Debugger } from "@graphql-debugger/utils";

const debugNamespace = "queue";

export const debug: Debugger = Debug(debugNamespace);
