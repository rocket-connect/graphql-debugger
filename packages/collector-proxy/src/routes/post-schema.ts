import { Request, Response } from "express";
import { debug } from "../debug";
import { validateRequest } from "../validate-request";
import { PostSchema, PostSchemaSchema } from "../schemas/post-schema";
import { prisma } from "@graphql-debugger/data-access";
import { graphql, hashSchema } from "@graphql-debugger/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";

async function postSchemaHandler(req: Request, res: Response) {
  debug("POST /v1/traces");

  try {
    const body = req.body as PostSchema["body"];
    const schema = body.schema;

    let executableSchema: graphql.GraphQLSchema;
    try {
      executableSchema = makeExecutableSchema({
        typeDefs: schema,
        noLocation: true,
      });
    } catch (error) {
      return res
        .status(400)
        .json({
          message: "Could not parse schema",
        })
        .end();
    }

    const hash = hashSchema(executableSchema);

    const foundSchema = await prisma.schema.findFirst({
      where: {
        hash,
      },
    });

    if (foundSchema) {
      return res.status(200).json({}).end();
    }

    await prisma.schema.create({
      data: {
        hash,
        typeDefs: graphql.print(graphql.parse(schema)),
      },
    });

    return res.status(200).json({}).end();
  } catch (error) {
    debug("Error posting schema", error);
    return res.status(500).json({}).end();
  }
}

export const postSchema: ((...args: any) => any)[] = [
  validateRequest(PostSchemaSchema),
  postSchemaHandler,
];
