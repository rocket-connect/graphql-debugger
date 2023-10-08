import { Queue, QueueType } from "@graphql-debugger/queue";
import { ForeignTraces } from "@graphql-debugger/types";

import express, { Express } from "express";
import http from "http";

import { debug } from "./debug";
import { postSchema } from "./routes/post-schema";
import { postTraces } from "./routes/post-traces";
import { foreignTracesWorker } from "./workers/foreign-traces";
import { postSchemaWorker } from "./workers/post-schema";
import { postTracesWorker } from "./workers/post-traces";

export const app: Express = express();
app.use(express.json({ limit: "500mb" }));

app.post("/v1/traces", postTraces);
export const postTracesQueue = new Queue({
  type: QueueType.InMemory,
  worker: postTracesWorker,
});

app.post("/v1/schema", postSchema);
export const postSchemaQueue = new Queue({
  type: QueueType.InMemory,
  worker: postSchemaWorker,
});

export const foreignTraces: Queue<ForeignTraces> = new Queue({
  type: QueueType.InMemory,
  worker: (data: ForeignTraces) =>
    foreignTracesWorker(data, (d) => foreignTraces.add(d)),
});

export async function start({ port }: { port: string }) {
  try {
    debug("Starting");

    const server = await app.listen(port);

    debug("Started");

    return server;
  } catch (error) {
    debug("Failed to start", error);
    throw error;
  }
}

export async function stop({ server }: { server: http.Server }) {
  await server.close();
}

export * from "./config";
