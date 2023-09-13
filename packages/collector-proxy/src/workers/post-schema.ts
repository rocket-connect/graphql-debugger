import type { PostSchema } from "@graphql-debugger/types";
import { hashSchema, print, parse } from "@graphql-debugger/utils";
import { prisma } from "@graphql-debugger/data-access";
import { debug } from "../debug";
import { makeExecutableSchema } from "@graphql-tools/schema";

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
