import { builder } from "../schema";

builder.queryField("ping", (t) =>
  t.field({
    type: "String",
    resolve: async () => {
      return "pong";
    },
  }),
);
