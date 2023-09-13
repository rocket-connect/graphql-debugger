import fs from "fs";
import { printSchema } from "graphql";
import path from "path";

import { schema } from "./schema";

fs.writeFileSync(
  path.resolve(__dirname, "./schema.graphql"),
  printSchema(schema),
);
