import { DebuggerClient } from "@graphql-debugger/client";
import type { PostSchema } from "@graphql-debugger/types";
import { hashSchema } from "@graphql-debugger/utils";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { parse, print } from "graphql";

import { debug } from "../debug";

export function postSchemaWorker({ client }: { client: DebuggerClient }) {
  return async (data: PostSchema["body"]) => {
    debug("postSchemaWorker started");

    try {
      const executableSchema = makeExecutableSchema({
        typeDefs: data.schema,
        noLocation: true,
      });

      const hash = hashSchema(executableSchema);

      const foundSchema = await client.schema.findFirst({
        where: {
          hash,
        },
      });

      if (foundSchema) {
        return;
      }

      await client.schema.createOne({
        data: {
          hash,
          schema: print(parse(data.schema)),
        },
      });
    } catch (error) {
      debug("postSchemaWorker Error: ", error);
    } finally {
      debug("postSchemaWorker finished");
    }
  };
}
