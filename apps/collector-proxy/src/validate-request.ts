import { z } from "@graphql-debugger/schemas";

import { NextFunction, Request, Response } from "express";

import { debug } from "./debug";

export function validateRequest(schema: z.AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const key in req.body) {
        if (["body", "headers"].includes(key)) {
          try {
            JSON.parse(req.body[key] || "{}");
          } catch (error) {
            return res
              .status(400)
              .send(`body.${key} is not a valid JSON string`)
              .end();
          }
        }
      }

      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      console.log(JSON.stringify(req.body, null, 2));
      debug("Error parsing request", error);

      const e = error as Error;

      return res.status(400).json({
        message: e.message,
      });
    }
  };
}
