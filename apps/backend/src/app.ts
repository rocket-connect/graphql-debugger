import { collector } from "@graphql-debugger/collector-proxy";
import { yoga } from "@graphql-debugger/graphql-schema";

import cors from "cors";
import express, { Express } from "express";
import path from "path";

import { debug } from "./debug";

export const backend: Express = express();
backend.use(cors());
backend.use("/graphql", yoga);
backend.use(express.static(path.join(__dirname, "../../ui/build")));
backend.use(express.static("public"));

export async function start({
  backendPort,
  collectorPort,
}: {
  backendPort: string;
  collectorPort: string;
}) {
  try {
    debug("Starting app");

    const _backend = await backend.listen(backendPort);
    const _collector = await collector.listen(collectorPort);

    debug("GraphQL online on port: ", backendPort);
    debug("Collector online on port: ", collectorPort);

    return {
      backend: _backend,
      collector: _collector,
    };
  } catch (error) {
    debug("Failed to connect to start app", error);
    throw error;
  }
}
