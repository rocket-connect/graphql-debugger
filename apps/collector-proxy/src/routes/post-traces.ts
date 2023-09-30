import { PostTracesSchema } from "@graphql-debugger/schemas";
import type { PostTraces } from "@graphql-debugger/types";

import { Request, Response } from "express";

import { debug } from "../debug";
import { postTracesQueue } from "../index";
import { validateRequest } from "../validate-request";

async function postTracesHandler(req: Request, res: Response) {
  debug("POST /v1/traces");

  try {
    const body = req.body as PostTraces["body"];

    await postTracesQueue.add(body);

    return res.status(200).json({}).end();
  } catch (error) {
    debug("Error posting traces", error);

    return res.status(500).json({}).end();
  }
}

export const postTraces: ((...args: any) => any)[] = [
  validateRequest(PostTracesSchema),
  postTracesHandler,
];
