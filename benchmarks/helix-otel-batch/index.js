import opentelemetry from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  BasicTracerProvider,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import cluster from "cluster";
import express from "express";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import {
  getGraphQLParameters,
  processRequest,
  sendResult,
} from "graphql-helix";
import { cpus } from "os";

process.env.PORT = "8000";

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "basic-service",
  }),
});

const exporter = new OTLPTraceExporter({});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

provider.register();

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: {
        hello: {
          type: GraphQLString,
          resolve: (root, args, context, info) => {
            const tracer = opentelemetry.trace.getTracer("example-tracer");
            const span = tracer.startSpan("say-hello");
            span.setAttribute("hello-to", "world");
            span.setAttribute("query", JSON.stringify(info.operation));
            span.addEvent("invoking resolvers");
            span.end();
            return "world";
          },
        },
      },
    }),
  });

  var app = express();
  app.use(express.json());

  app.use("/graphql", async (req, res) => {
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    });

    sendResult(result, res);
  });

  app.listen(8000);
}
