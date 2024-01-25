import { DebuggerClient } from "@graphql-debugger/client";
import { Queue } from "@graphql-debugger/queue";
import { PostTracesSchema } from "@graphql-debugger/schemas";
import type { PostTraces } from "@graphql-debugger/types";

import { Request, Response } from "express";

import { debug } from "../debug";
import { validateRequest } from "../validate-request";

function postTracesHandler({
  postTracesQueue,
}: {
  postTracesQueue: Queue<PostTraces["body"]>;
}) {
  return async (req: Request, res: Response) => {
    debug("POST /v1/traces");

    try {
      const body = req.body as PostTraces["body"];

      await postTracesQueue.add(body);

      return res.status(200).json({}).end();
    } catch (error) {
      debug("Error posting traces", error);

      return res.status(500).json({}).end();
    }
  };
}

export const postTraces: ({
  client,
  postTracesQueue,
}: {
  client: DebuggerClient;
  postTracesQueue: Queue<PostTraces["body"]>;
}) => ((...args: any) => any)[] = ({ postTracesQueue }) => [
  validateRequest(PostTracesSchema),
  postTracesHandler({
    postTracesQueue,
  }),
];
