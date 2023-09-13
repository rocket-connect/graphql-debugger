import { printSchema } from "@graphql-debugger/utils";
import { schema } from "./schema";
import fs from "fs";
import path from "path";

fs.writeFileSync(
  path.resolve(__dirname, "./schema.graphql"),
  printSchema(schema),
);
