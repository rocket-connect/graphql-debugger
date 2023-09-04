import { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";
import { graphql } from "@graphql-debugger/utils";
import fetch from "node-fetch";
import { debug } from "./debug";

const DEFAULT_URL = "http://localhost:4318/v1/traces";

function stripURL(url: string) {
  return url.replace("/v1/traces", "");
}

export class SchemaExporer {
  private url: string;
  private schemaString: string;

  constructor(
    public schema: graphql.GraphQLSchema,
    public exporterConfig?: OTLPExporterNodeConfigBase,
  ) {
    this.url = exporterConfig?.url ?? DEFAULT_URL;

    const sortedSchema = graphql.lexicographicSortSchema(this.schema);
    this.schemaString = graphql.printSchema(sortedSchema);
  }

  public start() {
    let counter = 0;

    const interval = setInterval(() => {
      (async () => {
        try {
          debug("Sending schema");

          const response = await fetch(stripURL(this.url) + "/v1/schema", {
            method: "POST",
            body: JSON.stringify({
              schema: this.schemaString,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok && response.status === 200) {
            clearInterval(interval);
          }
        } catch (error) {
          clearInterval(interval);

          debug("Error sending schema", error);
        } finally {
          counter++;

          if (counter === 1000) {
            clearInterval(interval);
          }
        }
      })();
    }, 1000);
  }
}
