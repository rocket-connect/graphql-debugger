import { DebuggerClient } from "@graphql-debugger/client";
import { Queue } from "@graphql-debugger/queue";
import { PostSchemaSchema } from "@graphql-debugger/schemas";
import type { PostSchema } from "@graphql-debugger/types";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { Request, Response } from "express";

import { debug } from "../debug";
import { validateRequest } from "../validate-request";

function postSchemaHandler({
  postSchemaQueue,
}: {
  postSchemaQueue: Queue<PostSchema["body"]>;
}) {
  return async (req: Request, res: Response) => {
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
  };
}

export const postSchema: ({
  client,
  postSchemaQueue,
}: {
  client: DebuggerClient;
  postSchemaQueue: Queue<PostSchema["body"]>;
}) => ((...args: any) => any)[] = ({ postSchemaQueue }) => [
  validateRequest(PostSchemaSchema),
  postSchemaHandler({
    postSchemaQueue,
  }),
];
