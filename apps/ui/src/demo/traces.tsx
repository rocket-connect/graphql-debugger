import { Trace } from "@graphql-debugger/types";

import { createPost } from "./create-post-traces";
import { failCreatePost } from "./fail-create-post-traces";
import { failedLogin, successfullLogin } from "./login-traces";
import { meQueryTrace } from "./me-traces";
import { postQuery } from "./posts-traces";

export const demoTraces: Trace[] = [
  meQueryTrace,
  successfullLogin,
  failedLogin,
  postQuery,
  createPost,
  failCreatePost,
];
