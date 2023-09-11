import { Request, Response } from "express";
import { debug } from "../debug";
import { validateRequest } from "../validate-request";
import { PostTraces, PostTracesSchema } from "../schemas/post-traces";
import { postTracesQueue } from "..";

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
