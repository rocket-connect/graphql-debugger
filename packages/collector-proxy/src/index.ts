import express, { Express } from "express";
import { postSchema } from "./routes/post-schema";
import { postTraces } from "./routes/post-traces";
import { Queue, QueueType } from "@graphql-debugger/queue";
import { postTracesWorker } from "./workers/post-traces";
import { postSchemaWorker } from "./workers/post-schema";

export const collector: Express = express();
collector.use(express.json({ limit: "500mb" }));

collector.post("/v1/traces", postTraces);
export const postTracesQueue = new Queue({
  type: QueueType.InMemory,
  worker: postTracesWorker,
});

collector.post("/v1/schema", postSchema);
export const postSchemaQueue = new Queue({
  type: QueueType.InMemory,
  worker: postSchemaWorker,
});
