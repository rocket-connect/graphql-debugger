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
  SpanExporter,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-base";

import { provider } from "./provider";

export type SetupOtelInput = {
  inMemory?: boolean;
  exporterConfig?: OTLPExporterNodeConfigBase;
  instrumentations?: InstrumentationOption[];
  spanProcessorFactory?: (exporter: SpanExporter) => SpanProcessor;
};

export function setupOtel({
  inMemory,
  exporterConfig,
  instrumentations,
  spanProcessorFactory,
}: SetupOtelInput): SpanExporter {
  let exporter: SpanExporter = new OTLPTraceExporter();
  if (inMemory) {
    exporter = new InMemorySpanExporter();
  } else {
    exporter = new OTLPTraceExporter(exporterConfig);
  }

  const contextManager = new AsyncHooksContextManager().enable();

  api.context.setGlobalContextManager(contextManager);

  const processor = spanProcessorFactory
    ? spanProcessorFactory(exporter)
    : new BatchSpanProcessor(exporter);

  provider.addSpanProcessor(processor);

  if (instrumentations) {
    registerInstrumentations({
      instrumentations,
    });
  }

  provider.register();

  return exporter;
}

export { OTLPTraceExporter, InMemorySpanExporter };
