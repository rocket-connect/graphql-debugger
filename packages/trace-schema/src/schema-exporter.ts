import { BaseAdapter } from "@graphql-debugger/adapter-base";
import { PostSchema } from "@graphql-debugger/types";
import { hashSchema } from "@graphql-debugger/utils";

import { GraphQLSchema, lexicographicSortSchema, printSchema } from "graphql";

import { debug } from "./debug";

export class SchemaExporer {
  private schema: GraphQLSchema;
  private schemaString: string;
  private schemaHash: string;
  private adapter: BaseAdapter;

  constructor({
    schema,
    adapter,
  }: {
    schema: GraphQLSchema;
    adapter: BaseAdapter;
  }) {
    this.schema = lexicographicSortSchema(schema);
    this.schemaString = printSchema(this.schema);
    this.schemaHash = hashSchema(this.schema);
    this.adapter = adapter;
  }

  public start() {
    let counter = 0;

    const interval = setInterval(() => {
      (async () => {
        try {
          debug("Sending schema");

          const body: PostSchema["body"] = {
            schema: this.schemaString,
            hash: this.schemaHash,
          };

          const response = await this.adapter.schema.createOne({
            data: {
              schema: body.schema,
              hash: body.hash,
            },
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
