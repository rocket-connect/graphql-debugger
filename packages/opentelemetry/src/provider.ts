import { Resource } from "@opentelemetry/resources";
import { BasicTracerProvider } from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const { name, version } = require("../package.json");

export const PROVIDER_NAME = name;

export const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: PROVIDER_NAME,
    [SemanticResourceAttributes.SERVICE_VERSION]: version,
  }),
});
