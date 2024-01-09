import { DebuggerClient } from "@graphql-debugger/client";
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

export async function start({
  port,
  client,
}: {
  port?: string;
  client: DebuggerClient;
}): Promise<{
  server?: http.Server;
}> {
  try {
    debug("Starting");

    let server: http.Server | undefined = undefined;

    if (port) {
      server = await app.listen(port);
    }

    const postSchemaQueue = new Queue({
      type: QueueType.InMemory,
      worker: postSchemaWorker({ client }),
    });

    const foreignTracesQueue: Queue<ForeignTraces> = new Queue({
      type: QueueType.InMemory,
      worker: (data: ForeignTraces) =>
        foreignTracesWorker({ client })(data, (d) => foreignTracesQueue.add(d)),
    });

    const postTracesQueue = new Queue({
      type: QueueType.InMemory,
      worker: postTracesWorker({ client, foreignTracesQueue }),
    });

    await Promise.all([
      postSchemaQueue.start(),
      foreignTracesQueue.start(),
      postTracesQueue.start(),
    ]);

    debug("Started");

    app.post("/v1/traces", postTraces({ client, postTracesQueue }));
    app.post("/v1/schema", postSchema({ client, postSchemaQueue }));

    return { server };
  } catch (error) {
    debug("Failed to start", error);
    throw error;
  }
}

export async function stop({ server }: { server: http.Server }) {
  await server.close();
}

export * from "./config";
