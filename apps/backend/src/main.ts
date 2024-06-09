import {
  SimpleSpanProcessor,
  SpanExporter,
} from "@graphql-debugger/opentelemetry";

import { client } from "./client";
import { BACKEND_PORT } from "./config";
import { debug } from "./debug";
import { start } from "./index";

const spanProcessorFactory =
  process.env.NODE_ENV === "development"
    ? (exporter: SpanExporter) => new SimpleSpanProcessor(exporter)
    : undefined;

start({ port: BACKEND_PORT, client, spanProcessorFactory })
  .then(() => {
    debug("Online");
  })
  .catch((error) => {
    debug(error);
    process.exit(1);
  });
