import { createYoga } from "graphql-yoga";

import { context } from "./context";
import { schema } from "./schema";

export const yoga = createYoga({
  schema,
  context,
});
