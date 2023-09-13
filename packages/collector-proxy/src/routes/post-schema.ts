import { Request, Response } from "express";
import { debug } from "../debug";
import { validateRequest } from "../validate-request";
import { PostSchemaSchema } from "@graphql-debugger/schemas";
import type { PostSchema } from "@graphql-debugger/types";
import { postSchemaQueue } from "..";
import { makeExecutableSchema } from "@graphql-tools/schema";

async function postSchemaHandler(req: Request, res: Response) {
  debug("POST /v1/schema");

  try {
    const body = req.body as PostSchema["body"];
    const schema = body.schema;

    try {
      makeExecutableSchema({
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

    await postSchemaQueue.add(body);

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
