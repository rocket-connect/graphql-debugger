import { Trace } from "@graphql-debugger/types";

import { failedLogin, successfullLogin } from "./login-traces";

export const demoTraces: Trace[] = [successfullLogin, failedLogin];
