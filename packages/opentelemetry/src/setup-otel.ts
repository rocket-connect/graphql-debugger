import * as api from "@opentelemetry/api";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  InstrumentationOption,
  registerInstrumentations,
} from "@opentelemetry/instrumentation";
import { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";
import { Resource } from "@opentelemetry/resources";
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

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

  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        "@graphql-debugger/traced-schema",
      [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  if (instrumentations) {
    registerInstrumentations({
      instrumentations,
    });
  }

  provider.register();

  return exporter;
}

export { OTLPTraceExporter, InMemorySpanExporter };
