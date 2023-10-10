import { DebuggerClient } from "@graphql-debugger/client";
import { SetupOtelInput } from "@graphql-debugger/opentelemetry";
import { PostSchema } from "@graphql-debugger/types";

import { GraphQLSchema, lexicographicSortSchema, printSchema } from "graphql";

import { debug } from "./debug";

const DEFAULT_URL = "http://localhost:4318/v1/traces";

function stripURL(url: string) {
  return url.replace("/v1/traces", "");
}

export class SchemaExporer {
  private schema: GraphQLSchema;
  private url: string;
  private schemaString: string;
  private client: DebuggerClient;

  constructor(
    schema: GraphQLSchema,
    exporterConfig?: SetupOtelInput["exporterConfig"],
  ) {
    this.schema = schema;
    this.url = exporterConfig?.url ?? DEFAULT_URL;

    const sortedSchema = lexicographicSortSchema(this.schema);
    this.schemaString = printSchema(sortedSchema);

    this.client = new DebuggerClient({
      collectorUrl: stripURL(this.url),
    });
  }

  public start() {
    let counter = 0;

    const interval = setInterval(() => {
      (async () => {
        try {
          debug("Sending schema");

          const body: PostSchema["body"] = {
            schema: this.schemaString,
          };

          const response = await this.client.schema.createOne({
            data: body,
          });

          if (response) {
            debug("Schema sent");
            clearInterval(interval);
          }
        } catch (error) {
          debug("Error sending schema", error);
          debug("Retrying in 1 second");
        } finally {
          counter++;
          if (counter === 100) {
            clearInterval(interval);
          }
        }
      })();
    }, 1000);
  }
}
