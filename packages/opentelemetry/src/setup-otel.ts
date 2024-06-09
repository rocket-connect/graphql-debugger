import * as api from "@opentelemetry/api";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  InstrumentationOption,
  registerInstrumentations,
} from "@opentelemetry/instrumentation";
import { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";
import {
  BatchSpanProcessor,
  InMemorySpanExporter,
} from "@opentelemetry/sdk-trace-base";

import { provider } from "./provider";

export type SetupOtelInput = {
  inMemory?: boolean;
  exporterConfig?: OTLPExporterNodeConfigBase;
  instrumentations?: InstrumentationOption[];
};

export function setupOtel({
  inMemory,
  exporterConfig,
  instrumentations,
}: SetupOtelInput): OTLPTraceExporter | InMemorySpanExporter {
  let exporter: OTLPTraceExporter | InMemorySpanExporter =
    new OTLPTraceExporter();
  if (inMemory) {
    exporter = new InMemorySpanExporter();
  } else {
    exporter = new OTLPTraceExporter(exporterConfig);
  }

  const contextManager = new AsyncHooksContextManager().enable();

  api.context.setGlobalContextManager(contextManager);

  provider.addSpanProcessor(new BatchSpanProcessor(exporter));

  if (instrumentations) {
    registerInstrumentations({
      instrumentations,
    });
  }

  provider.register();

  return exporter;
}

export { OTLPTraceExporter, InMemorySpanExporter };
