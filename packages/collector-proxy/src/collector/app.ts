import { prisma } from "@graphql-debugger/data-access";
import { graphql, hashSchema } from "@graphql-debugger/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express, { Express } from "express";
import { z } from "zod";
import { schema } from "./schema";
import { debug } from "../debug";
import { queue } from "./queue";

export const collector: Express = express();
collector.use(express.json({ limit: "500mb" }));

collector.post("/v1/traces", async (req, res) => {
  debug("POST /v1/traces");

  try {
    let body: z.infer<typeof schema>["body"];

    try {
      schema.parse({ body: req.body });
      body = req.body as z.infer<typeof schema>["body"];
    } catch (error) {
      debug("Error parsing body", error);

      return res
        .status(400)
        .json({
          message: (error as Error).message,
        })
        .end();
    }

    await queue.push(body);

    return res.status(200).json({}).end();
  } catch (error) {
    debug("Error posting traces", error);

    return res.status(500).json({}).end();
  }
});

collector.post("/v1/schema", async (req, res) => {
  try {
    const schema = req.body.schema;

    if (!schema) {
      return res.status(400).json({}).end();
    } else if (typeof schema !== "string") {
      return res.status(400).json({}).end();
    }

    const executableSchema = makeExecutableSchema({
      typeDefs: schema,
      noLocation: true,
    });

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
});
