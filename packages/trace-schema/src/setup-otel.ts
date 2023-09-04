import * as api from "@opentelemetry/api";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";
import { Resource } from "@opentelemetry/resources";
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export function setupOtel({
  exporterConfig,
}: {
  exporterConfig?: OTLPExporterNodeConfigBase;
}) {
  const contextManager = new AsyncHooksContextManager().enable();

  api.context.setGlobalContextManager(contextManager);

  const otlpTraceExporter = new OTLPTraceExporter(exporterConfig);

  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        "@graphql-debugger/traced-schema",
      [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(otlpTraceExporter));

  provider.register();
}
