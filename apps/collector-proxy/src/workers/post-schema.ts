import { prisma } from "@graphql-debugger/data-access";
import type { PostSchema } from "@graphql-debugger/types";
import { hashSchema } from "@graphql-debugger/utils";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { parse, print } from "graphql";

import { debug } from "../debug";

export async function postSchemaWorker(data: PostSchema["body"]) {
  debug("Worker started");

  try {
    const executableSchema = makeExecutableSchema({
      typeDefs: data.schema,
      noLocation: true,
    });

    const hash = hashSchema(executableSchema);

    const foundSchema = await prisma.schema.findFirst({
      where: {
        hash,
      },
    });

    if (foundSchema) {
      return;
    }

    await prisma.schema.create({
      data: {
        hash,
        typeDefs: print(parse(data.schema)),
      },
    });
  } catch (error) {
    debug("Error posting schema", error);
  } finally {
    debug("Worker finished");
  }
}
