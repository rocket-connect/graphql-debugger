import { DebuggerClient } from "@graphql-debugger/client";
import { createSchema } from "@graphql-debugger/graphql-schema";
import { traceSchema } from "@graphql-debugger/trace-schema";

import fs from "fs";
import { printSchema } from "graphql";
import path from "path";

const printPath = path.join(__dirname, "../", "out/", "schema.gql");

// Prints the development schema in this package for dev usage
// Run `pnpm run dev` at the root of the monorepo to run debugger in debug mode
// Run the development version of the extension using F5 or the "Run Extension" command
// Open this schema file and it will trigger the extension
async function printSchemaForDebugging() {
  const client = new DebuggerClient();
  const { schema } = createSchema({ client });

  const tracedSchema = traceSchema({ schema, adapter: client.adapter });

  const printed = printSchema(tracedSchema);

  await fs.promises.writeFile(printPath, printed);

  process.exit(0);
}

printSchemaForDebugging();
