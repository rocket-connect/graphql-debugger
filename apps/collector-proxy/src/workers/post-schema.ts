import type { PostSchema } from "@graphql-debugger/types";
import { hashSchema } from "@graphql-debugger/utils";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { parse, print } from "graphql";

import { client } from "../client";
import { debug } from "../debug";

export async function postSchemaWorker(data: PostSchema["body"]) {
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

    // TODO - unify client
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
}
