import { Trace } from "@graphql-debugger/types";

import { failedLogin, successfullLogin } from "./login-traces";
import { meQueryTrace } from "./me-traces";
import { postQuery } from "./posts-traces";

export const demoTraces: Trace[] = [
  meQueryTrace,
  successfullLogin,
  failedLogin,
  postQuery,
];
